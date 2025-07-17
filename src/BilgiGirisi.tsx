import React, { useState } from 'react';

const BilgiGirisi = () => {
    const [fakulte, setFakulte] = useState('');
    const [yeniInput, setYeniInput] = useState('');

    return (
        <div style={{
            width: '100%',
            height: '100vh',
            background: '#fff',
            margin: 0,
            padding: 0,
            position: 'relative',
            overflow: 'hidden',
            overflowX: 'hidden',
        }}>
            <h1 style={{
                fontFamily: 'Space Grotesk',
                fontWeight: 700,
                fontSize: 64,
                color: '#000',
                position: 'absolute',
                top: 32,
                left: 64,
                margin: 0,
                padding: 0,
                letterSpacing: '-0.01em',
            }}>
                Bilgi Girişi
            </h1>
            {/* Üstteki div */}
            <div style={{
                position: 'absolute',
                top: 180,
                left: 64,
                width: 700,
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
            }}>
                <div style={{
                    fontFamily: 'Space Grotesk',
                    fontWeight: 400,
                    fontSize: 28,
                    color: '#222',
                }}>
                    Yeni Fakülte / Meslek Yüksekokulu Ekle
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 18 }}>
                    <input
                        type="text"
                        placeholder="Eklemek istediğiniz fakülte ismini giriniz..."
                        value={fakulte}
                        onChange={e => setFakulte(e.target.value)}
                        style={{
                            flex: 2,
                            fontFamily: 'Space Grotesk',
                            fontSize: 16,
                            padding: '18px 24px',
                            border: '2px solid #E0E0E0',
                            borderRadius: 10,
                            background: '#F0EFFF',
                            color: '#222',
                            outline: 'none',
                            minWidth: 0,
                            height: 60,
                        }}
                    />
                    <button
                        style={{
                            flex: 0,
                            fontFamily: 'Space Grotesk',
                            fontWeight: 700,
                            fontSize: 22,
                            padding: '18px 40px',
                            border: 'none',
                            borderRadius: 10,
                            background: '#4A4E68',
                            color: '#fff',
                            cursor: 'pointer',
                            boxShadow: '0 2px 16px #e0e0e0',
                            transition: 'background 0.2s',
                            height: 60,
                        }}
                    >
                        Kaydet
                    </button>
                </div>
            </div>
            {/* Alttaki yeni div */}
            <div style={{
                position: 'absolute',
                top: 300,
                left: 64,
                width: 700,
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                marginTop: 48,
            }}>
                <div style={{
                    fontFamily: 'Space Grotesk',
                    fontWeight: 400,
                    fontSize: 28,
                    color: '#222',
                }}>
                    Salon Ekle
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 18 }}>
                    <select
                        value={yeniInput}
                        onChange={e => setYeniInput(e.target.value)}
                        style={{
                            flex: 2,
                            fontFamily: 'Space Grotesk',
                            fontSize: 16,
                            padding: '18px 24px',
                            border: '2px solid #E0E0E0',
                            borderRadius: 10,
                            background: '#F0EFFF',
                            color: '#222',
                            outline: 'none',
                            minWidth: 0,
                            height: 60,
                            appearance: 'none',
                        }}
                    >
                        <option value="">Bir seçenek seçin...</option>
                        <option value="secenek1">Seçenek 1</option>
                        <option value="secenek2">Seçenek 2</option>
                        <option value="secenek3">Seçenek 3</option>
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 18, marginTop: 8 }}>
                    <input
                        type="text"
                        placeholder="Eklemek istediğiniz salon ismini giriniz..."
                        style={{
                            flex: 2,
                            fontFamily: 'Space Grotesk',
                            fontSize: 16,
                            padding: '18px 24px',
                            border: '2px solid #E0E0E0',
                            borderRadius: 10,
                            background: '#F0EFFF',
                            color: '#222',
                            outline: 'none',
                            minWidth: 0,
                            height: 60,
                        }}
                    />
                </div>
                <button
                    style={{
                        flex: 0,
                        fontFamily: 'Space Grotesk',
                        fontWeight: 700,
                        fontSize: 22,
                        padding: '18px 40px',
                        border: 'none',
                        borderRadius: 10,
                        background: '#4A4E68',
                        color: '#fff',
                        cursor: 'pointer',
                        boxShadow: '0 2px 16px #e0e0e0',
                        transition: 'background 0.2s',
                        marginTop: 16,
                        marginLeft: 0,
                        height: 60,
                    }}
                >
                    Kaydet
                </button>
            </div>
        </div>
    );
};

export default BilgiGirisi; 