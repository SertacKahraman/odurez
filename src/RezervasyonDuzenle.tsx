import React, { useState } from 'react';
import './RezervasyonOlustur.css';
import { useNavigate } from 'react-router-dom';

const RezervasyonDuzenle: React.FC = () => {
    // Kullanıcı ve menü stateleri
    const [user, setUser] = useState<any>(() => {
        try {
            let u = JSON.parse(localStorage.getItem('user') || 'null');
            if (!u || !u.role) {
                const token = localStorage.getItem('token');
                if (token) {
                    const payload = token.split('.')[1];
                    if (payload) {
                        try {
                            const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
                            let role = decoded.role || (decoded.authorities && decoded.authorities[0]?.authority) || null;
                            if (typeof role === 'string' && role.startsWith('ROLE_')) {
                                role = role.replace('ROLE_', '');
                            }
                            if (!role && Array.isArray(decoded.authorities) && decoded.authorities.length > 0) {
                                role = decoded.authorities[0]?.authority?.replace('ROLE_', '') || null;
                            }
                            u = { username: decoded.sub || decoded.username || '', role };
                        } catch (e) { /* ignore */ }
                    }
                }
            }
            return u;
        } catch {
            return null;
        }
    });
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [showLogoutMenu, setShowLogoutMenu] = useState(false);
    const navigate = useNavigate();
    const view = '';
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    // Form alanları
    const [fakulte, setFakulte] = useState('');
    const [fakulteler, setFakulteler] = useState<any[]>([]);
    const [fakulteYuklendi, setFakulteYuklendi] = useState(false);

    const [sinif, setSinif] = useState('');
    const [kullanimTuru, setKullanimTuru] = useState('');
    const [baslik, setBaslik] = useState('');
    const [aciklama, setAciklama] = useState('');
    const [seciliTarih, setSeciliTarih] = useState<number | null>(null);
    const [baslangicSaati, setBaslangicSaati] = useState('13:00');
    const [bitisSaati, setBitisSaati] = useState('14:00');
    const [tarih, setTarih] = useState(new Date());
    const [mesaj, setMesaj] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const mevcutRezervasyonlar = [
        '15:00 - 17:00 Saatleri Arası Dolu',
        '12:00 - 13:00 Saatleri Arası Dolu',
        '09:00 - 10:00 Saatleri Arası Dolu',
        '08:00 - 09:00 Saatleri Arası Dolu',
    ];

    // Haftanın günleri Pazartesi başlar, Pazar sona gelir
    const gunler = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'];
    const aylar = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    // Ay değiştir fonksiyonları
    const oncekiAy = () => setTarih(new Date(tarih.getFullYear(), tarih.getMonth() - 1));
    const sonrakiAy = () => setTarih(new Date(tarih.getFullYear(), tarih.getMonth() + 1));

    const ay = tarih.getMonth();
    const yil = tarih.getFullYear();

    // Haftanın ilk günü Pazartesi olacak şekilde (Pazar 6 olarak)
    const ilkGun = (new Date(yil, ay, 1).getDay() + 6) % 7;
    const gunSayisi = new Date(yil, ay + 1, 0).getDate();

    const tarihleriHazirla = () => {
        const gunlerArray: (number | null)[][] = [];
        let sayac = 1;
        // 5 hafta gösteriyoruz
        for (let i = 0; i < 5; i++) {
            const hafta: (number | null)[] = [];
            for (let j = 0; j < 7; j++) {
                if ((i === 0 && j < ilkGun) || sayac > gunSayisi) {
                    hafta.push(null);
                } else {
                    hafta.push(sayac);
                    sayac++;
                }
            }
            gunlerArray.push(hafta);
        }
        return gunlerArray;
    };

    const saatler24 = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    const bugun = new Date();
    const bugunGun = (bugun.getFullYear() === yil && bugun.getMonth() === ay) ? bugun.getDate() : null;

    // Fakülte verisini çek
    const fakulteGetir = async () => {
        if (fakulteYuklendi) return;
        try {
            const response = await fetch('http://10.15.0.15:8080/kullanicilar');
            if (!response.ok) throw new Error('Sunucu hatası');
            const data = await response.json();
            setFakulteler(data);
            setFakulteYuklendi(true);
        } catch (error) {
            console.error('Fakülteler alınamadı:', error);
        }
    };

    // Rezervasyon güncelle (şimdilik oluştur ile aynı, sonra güncelleme yapılacak)
    const rezervasyonGuncelle = async (e: React.FormEvent) => {
        e.preventDefault();
        setMesaj(null);
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const gun = seciliTarih ? seciliTarih : null;
            if (!fakulte || !sinif || !kullanimTuru || !baslik || !aciklama || !gun) {
                setMesaj('Lütfen tüm alanları doldurun.');
                setLoading(false);
                return;
            }
            const tarihStr = `${tarih.getFullYear()}-${String(tarih.getMonth() + 1).padStart(2, '0')} -${String(gun).padStart(2, '0')}`;
            const payload = {
                fakulte,
                sinif,
                tur: kullanimTuru,
                baslik,
                aciklama,
                tarih: tarihStr,
                baslangicSaati,
                bitisSaati
            };
            // TODO: PATCH veya PUT ile güncelleme yapılacak
            const res = await fetch('http://10.15.0.15:8080/rezervasyonlar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': 'Bearer ' + token } : {})
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Rezervasyon güncellenemedi');
            setMesaj('Rezervasyon başarıyla güncellendi!');
        } catch (err: any) {
            setMesaj('Hata: ' + (err.message || 'Rezervasyon güncellenemedi.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ width: '100%', height: '100%', background: 'white' }}>
            <h1 className="ana-baslik">Rezervasyon Düzenle</h1>
            {mesaj && <div style={{ marginBottom: 16, color: mesaj.startsWith('Hata') ? 'red' : 'green', fontWeight: 600 }}>{mesaj}</div>}
            <form className="form-genel-kapsayici" onSubmit={rezervasyonGuncelle}>
                <div className="form-sol">
                    <p className="form-baslik">Fakülte veya Meslek Yüksekokulu Seçiniz</p>
                    <select
                        value={fakulte}
                        onChange={e => setFakulte(e.target.value)}
                        onClick={fakulteGetir}
                    >
                        <option value="" disabled hidden>Örn. Eğitim Fakültesi</option>
                        {fakulteler.length > 0 && (
                            fakulteler.map((f: any, i) => (
                                <option key={i} value={f.id || f.ad}>{f.ad || f.name}</option>
                            ))
                        )}
                    </select>

                    <p className="form-baslik">Sınıf / Salon Seçiniz</p>
                    <select value={sinif} onChange={e => setSinif(e.target.value)} >
                        <option value="" disabled hidden>Örn. Amfi - 1</option>
                        <option value="Amfi - 1">Amfi - 1</option>
                        <option value="Amfi - 2">Amfi - 2</option>
                        <option value="Derslik - 101">Derslik - 101</option>
                    </select>

                    <p className="form-baslik">Kullanım Türünü Seçiniz</p>
                    <select value={kullanimTuru} onChange={e => setKullanimTuru(e.target.value)} >
                        <option value="" disabled hidden>Örn. Sınav</option>
                        <option value="Sınav">Sınav</option>
                        <option value="Ders">Ders</option>
                        <option value="Etkinlik">Etkinlik</option>
                        <option value="Sunum">Sunum</option>
                        <option value="Toplantı">Toplantı</option>
                        <option value="Diğer">Diğer</option>
                    </select>

                    <p className="form-baslik">Rezervasyon Başlığı</p>
                    <input
                        type="text"
                        placeholder="Örn. Fizik -2 Sınavı..."
                        value={baslik}
                        onChange={e => setBaslik(e.target.value)}
                    />

                    <p className="form-baslik">Rezervasyon Açıklaması</p>
                    <textarea
                        placeholder="Örn. Bilgisayar Mühendisliği bölümü Fizik -2 sınavı yapılacaktır."
                        value={aciklama}
                        onChange={e => setAciklama(e.target.value)}
                    />
                </div>

                <div className="form-sag">
                    <div className="takvim-grup">
                        <div className="takvim-kapsayici">
                            <div className="takvim-ust">
                                <button type="button" onClick={oncekiAy}>&lt;</button>
                                <span>{aylar[ay]} {yil}</span>
                                <button type="button" onClick={sonrakiAy}>&gt;</button>
                            </div>
                            <div className="takvim-gunler">
                                {gunler.map((g, i) => (
                                    <div
                                        key={i}
                                        className={`gun-etiketi${i === 5 || i === 6 ? ' haftasonu' : ''}`}
                                    >
                                        {g}
                                    </div>
                                ))}

                                {tarihleriHazirla().flat().map((g, i) => {
                                    if (!g) {
                                        return <div key={i} className="bos-gun" />;
                                    }
                                    const haftaninGunu = i % 7;
                                    const isBugun = g === bugunGun;
                                    return (
                                        <div
                                            key={i}
                                            className={`gun-kutusu-tarih${isBugun ? ' bugun' : ''}${haftaninGunu === 5 || haftaninGunu === 6 ? ' haftasonu' : ''}${seciliTarih === g ? ' secili-tarih' : ''}`}
                                            onClick={() => setSeciliTarih(g)}
                                            style={{ fontWeight: seciliTarih === g ? 'bold' : 'normal' }}
                                        >
                                            {g}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Saat ve Rezervasyon Grupları */}
                        <div className="saat-ve-rezervasyon-gruplari">
                            <div className="saat-grubu">
                                <div className="saat-baslik">Saat Aralığını Seçiniz</div>
                                <div className="saat-secimi">
                                    <select value={baslangicSaati} onChange={e => setBaslangicSaati(e.target.value)}>
                                        {saatler24.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                    <select value={bitisSaati} onChange={e => setBitisSaati(e.target.value)}>
                                        {saatler24.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="secili-saat-araligi">
                                    {baslangicSaati} - {bitisSaati} Saatleri Rezervasyon İçin Seçilidir
                                </div>
                            </div>

                            <div className="rezervasyon-grubu">
                                <h3>Seçilen Gün ve Salona Ait Mevcut Rezervasyonlar</h3>
                                <ul>
                                    {mevcutRezervasyonlar.map((r, i) => (
                                        <li key={i}>{r}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>

                <button className="rezervasyon-olustur-butonu" type="submit" disabled={loading}>
                    {loading ? 'Gönderiliyor...' : 'Rezervasyonu Güncelle'}
                </button>
            </form >
        </div >
    );
};

export default RezervasyonDuzenle; 