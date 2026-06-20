'use client';

import { useState, useEffect } from 'react';
import { loginAdmin, isAdminLoggedIn, logoutAdmin } from '@/lib/adminAuth';
import { loadSettings, saveSettings, type AdminSettings, type Announcement } from '@/lib/iqamaSettings';

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'iqama' | 'announcements' | 'audio' | 'maintenance' | 'advanced'>('iqama');
  const [newAnnouncement, setNewAnnouncement] = useState({ ar: '', es: '', duration: 10 });
  const [testingAudio, setTestingAudio] = useState(false);

  useEffect(() => {
    const auth = isAdminLoggedIn();
    setLoggedIn(auth);
    if (auth) setSettings(loadSettings());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(password)) {
      setLoggedIn(true);
      setSettings(loadSettings());
      setLoginError('');
    } else {
      setLoginError('كلمة المرور غير صحيحة · Contraseña incorrecta');
    }
  };

  const handleSave = () => {
    if (!settings) return;
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateIqama = (key: string, value: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      iqamaOffsets: { ...settings.iqamaOffsets, [key]: value },
    });
  };

  const addAnnouncement = () => {
    if (!settings || !newAnnouncement.ar) return;
    const ann: Announcement = {
      id: Date.now().toString(),
      ar: newAnnouncement.ar,
      es: newAnnouncement.es,
      duration: newAnnouncement.duration,
      active: true,
    };
    setSettings({ ...settings, announcements: [...settings.announcements, ann] });
    setNewAnnouncement({ ar: '', es: '', duration: 10 });
  };

  const removeAnnouncement = (id: string) => {
    if (!settings) return;
    setSettings({ ...settings, announcements: settings.announcements.filter(a => a.id !== id) });
  };

  const toggleAnnouncement = (id: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      announcements: settings.announcements.map(a =>
        a.id === id ? { ...a, active: !a.active } : a,
      ),
    });
  };

  const testAudio = () => {
    if (!settings) return;
    setTestingAudio(true);
    const audio = new Audio(`/adhan/${settings.audio.reader}-regular.mp3`);
    audio.volume = settings.audio.volume;
    audio.play().catch(() => {});
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
      setTestingAudio(false);
    }, 5000);
  };

  if (!loggedIn) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#0A2E26' }}
      >
        <div
          className="p-8 rounded-2xl w-full max-w-md"
          style={{ background: '#103D32', border: '1px solid #D4AF37' }}
        >
          <h1
            className="text-center text-3xl font-bold mb-2"
            style={{ fontFamily: 'Reem Kufi, sans-serif', color: '#D4AF37' }}
          >
            لوحة التحكم
          </h1>
          <p className="text-center mb-6" style={{ color: '#C8C2B0', fontFamily: 'Inter' }}>
            Panel de Administración · Mezquita Al Huda
          </p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="كلمة المرور · Contraseña"
              className="px-4 py-3 rounded-lg text-center text-lg"
              style={{
                background: '#1A5546',
                border: '1px solid #D4AF37',
                color: '#FAF7F0',
                fontFamily: 'Cairo, sans-serif',
                outline: 'none',
              }}
              autoFocus
            />
            {loginError && (
              <p className="text-center text-sm" style={{ color: '#FB923C' }}>{loginError}</p>
            )}
            <button
              type="submit"
              className="py-3 rounded-lg font-bold text-lg transition-all"
              style={{
                background: '#D4AF37',
                color: '#0A2E26',
                fontFamily: 'Cairo, sans-serif',
                cursor: 'pointer',
              }}
            >
              دخول · Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  const tabs: Array<{ id: typeof activeTab; label: string }> = [
    { id: 'iqama', label: 'أوقات الإقامة' },
    { id: 'announcements', label: 'الإعلانات' },
    { id: 'audio', label: 'الأذان الصوتي' },
    { id: 'maintenance', label: 'الصيانة' },
    { id: 'advanced', label: 'متقدم' },
  ];

  const PRAYER_LABELS = [
    { key: 'fajr', ar: 'الفجر', es: 'Fajr' },
    { key: 'dhuhr', ar: 'الظهر', es: 'Dhuhr' },
    { key: 'asr', ar: 'العصر', es: 'Asr' },
    { key: 'maghrib', ar: 'المغرب', es: 'Maghrib' },
    { key: 'isha', ar: 'العشاء', es: 'Isha' },
  ];

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: '#071E19',
        fontFamily: 'Cairo, sans-serif',
        color: '#FAF7F0',
        direction: 'rtl',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid #D4AF37' }}>
        <div className="flex items-center gap-4">
          <img
            src="/icons/logo.png"
            alt="Logo"
            style={{ width: '64px', height: '64px', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}
          />
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#D4AF37', fontFamily: 'Reem Kufi, sans-serif' }}>
              لوحة التحكم — مسجد الهدى
            </h1>
            <p style={{ color: '#C8C2B0', fontFamily: 'Inter', direction: 'ltr' }}>
              Mezquita Al Huda · Costa Calma, Fuerteventura
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="px-4 py-2 rounded-lg text-sm"
            style={{ background: '#1A5546', border: '1px solid #D4AF37', color: '#D4AF37', textDecoration: 'none' }}
          >
            ← الشاشة الرئيسية
          </a>
          <button
            onClick={() => { logoutAdmin(); setLoggedIn(false); }}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ background: 'rgba(251,146,60,0.2)', border: '1px solid #FB923C', color: '#FB923C', cursor: 'pointer' }}
          >
            خروج
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-5 py-2 rounded-lg font-bold transition-all"
            style={{
              background: activeTab === tab.id ? '#D4AF37' : '#103D32',
              color: activeTab === tab.id ? '#0A2E26' : '#C8C2B0',
              border: activeTab === tab.id ? 'none' : '1px solid rgba(212,175,55,0.3)',
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className="rounded-2xl p-6"
        style={{ background: '#103D32', border: '1px solid rgba(212,175,55,0.3)' }}
      >
        {/* IQAMA TIMES */}
        {activeTab === 'iqama' && (
          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#D4AF37' }}>أوقات الإقامة</h2>
            <p className="text-sm mb-6" style={{ color: '#8B8676', fontFamily: 'Inter', direction: 'ltr' }}>
              Number of minutes after Adhan when Iqama is called
            </p>
            <div className="grid grid-cols-1 gap-4 max-w-lg">
              {PRAYER_LABELS.map(({ key, ar, es }) => (
                <div key={key} className="flex items-center gap-4">
                  <span className="w-24 text-right font-bold" style={{ color: '#F4D03F' }}>{ar}</span>
                  <span className="w-20 text-sm" style={{ color: '#8B8676', fontFamily: 'Inter' }}>{es}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateIqama(key, Math.max(0, (settings.iqamaOffsets as any)[key] - 1))}
                      className="w-8 h-8 rounded-lg font-bold text-lg flex items-center justify-center"
                      style={{ background: '#1A5546', border: '1px solid #D4AF37', color: '#D4AF37', cursor: 'pointer' }}
                    >−</button>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      value={(settings.iqamaOffsets as any)[key]}
                      onChange={e => updateIqama(key, parseInt(e.target.value) || 0)}
                      className="w-16 text-center text-xl font-bold rounded-lg py-1"
                      style={{ background: '#1A5546', border: '1px solid rgba(212,175,55,0.5)', color: '#FAF7F0', outline: 'none' }}
                    />
                    <button
                      onClick={() => updateIqama(key, Math.min(60, (settings.iqamaOffsets as any)[key] + 1))}
                      className="w-8 h-8 rounded-lg font-bold text-lg flex items-center justify-center"
                      style={{ background: '#1A5546', border: '1px solid #D4AF37', color: '#D4AF37', cursor: 'pointer' }}
                    >+</button>
                    <span className="text-sm" style={{ color: '#8B8676' }}>دقيقة</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#D4AF37' }}>الإعلانات</h2>
            {/* Add new */}
            <div
              className="rounded-xl p-4 mb-6"
              style={{ background: '#1A5546', border: '1px solid rgba(212,175,55,0.3)' }}
            >
              <h3 className="text-lg font-bold mb-3" style={{ color: '#C8C2B0' }}>إضافة إعلان جديد</h3>
              <div className="flex flex-col gap-3">
                <textarea
                  value={newAnnouncement.ar}
                  onChange={e => setNewAnnouncement({ ...newAnnouncement, ar: e.target.value })}
                  placeholder="نص الإعلان بالعربية..."
                  rows={2}
                  className="px-4 py-2 rounded-lg resize-none"
                  style={{ background: '#103D32', border: '1px solid rgba(212,175,55,0.3)', color: '#FAF7F0', outline: 'none', direction: 'rtl' }}
                />
                <textarea
                  value={newAnnouncement.es}
                  onChange={e => setNewAnnouncement({ ...newAnnouncement, es: e.target.value })}
                  placeholder="Texto del anuncio en español..."
                  rows={2}
                  className="px-4 py-2 rounded-lg resize-none"
                  style={{ background: '#103D32', border: '1px solid rgba(212,175,55,0.3)', color: '#FAF7F0', outline: 'none', direction: 'ltr', fontFamily: 'Inter' }}
                />
                <div className="flex items-center gap-3">
                  <label style={{ color: '#C8C2B0' }}>مدة العرض:</label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={newAnnouncement.duration}
                    onChange={e => setNewAnnouncement({ ...newAnnouncement, duration: parseInt(e.target.value) || 10 })}
                    className="w-20 text-center px-2 py-1 rounded-lg"
                    style={{ background: '#103D32', border: '1px solid rgba(212,175,55,0.3)', color: '#FAF7F0', outline: 'none' }}
                  />
                  <span style={{ color: '#8B8676' }}>ثانية</span>
                  <button
                    onClick={addAnnouncement}
                    className="px-6 py-2 rounded-lg font-bold mr-auto"
                    style={{ background: '#D4AF37', color: '#0A2E26', cursor: 'pointer' }}
                  >
                    + إضافة
                  </button>
                </div>
              </div>
            </div>

            {/* Existing announcements */}
            {settings.announcements.length === 0 ? (
              <p style={{ color: '#8B8676' }}>لا توجد إعلانات بعد</p>
            ) : (
              <div className="flex flex-col gap-3">
                {settings.announcements.map(ann => (
                  <div
                    key={ann.id}
                    className="rounded-xl p-4 flex items-start gap-4"
                    style={{
                      background: ann.active ? '#1A5546' : 'rgba(26,85,70,0.4)',
                      border: `1px solid ${ann.active ? '#D4AF37' : 'rgba(212,175,55,0.2)'}`,
                    }}
                  >
                    <div className="flex-1">
                      <p style={{ direction: 'rtl', marginBottom: '4px' }}>{ann.ar}</p>
                      <p style={{ direction: 'ltr', color: '#C8C2B0', fontFamily: 'Inter', fontSize: '14px' }}>{ann.es}</p>
                      <p style={{ color: '#8B8676', fontSize: '12px', marginTop: '4px' }}>{ann.duration}s</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleAnnouncement(ann.id)}
                        className="px-3 py-1 rounded-lg text-sm font-bold"
                        style={{
                          background: ann.active ? 'rgba(74,222,128,0.2)' : 'rgba(139,134,118,0.2)',
                          border: `1px solid ${ann.active ? '#4ADE80' : '#8B8676'}`,
                          color: ann.active ? '#4ADE80' : '#8B8676',
                          cursor: 'pointer',
                        }}
                      >
                        {ann.active ? 'مفعّل' : 'معطّل'}
                      </button>
                      <button
                        onClick={() => removeAnnouncement(ann.id)}
                        className="px-3 py-1 rounded-lg text-sm"
                        style={{ background: 'rgba(251,146,60,0.2)', border: '1px solid #FB923C', color: '#FB923C', cursor: 'pointer' }}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AUDIO */}
        {activeTab === 'audio' && (
          <div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#D4AF37' }}>الأذان الصوتي</h2>

            {/* Warning */}
            <div
              className="rounded-xl p-4 mb-6 flex items-start gap-3"
              style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.4)' }}
            >
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-bold mb-1" style={{ color: '#FB923C' }}>تنبيه مهم</p>
                <p style={{ color: '#C8C2B0', lineHeight: 1.6 }}>
                  يُنصح بإبقاء الأذان الصوتي مُغلقاً واعتماد المؤذن البشري. الأذان الإلكتروني يعمل فقط عند الاتصال بالإنترنت.
                </p>
                <p style={{ color: '#8B8676', fontFamily: 'Inter', direction: 'ltr', marginTop: '4px', fontSize: '14px' }}>
                  It is recommended to keep audio Adhan disabled and rely on the human muadhdhin.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5 max-w-md">
              {/* Toggle */}
              <div className="flex items-center gap-4">
                <span className="font-bold" style={{ color: '#F4D03F' }}>تفعيل الأذان الصوتي:</span>
                <button
                  onClick={() => setSettings({ ...settings, audio: { ...settings.audio, enabled: !settings.audio.enabled } })}
                  className="relative w-14 h-7 rounded-full transition-all"
                  style={{
                    background: settings.audio.enabled ? '#4ADE80' : '#1A5546',
                    border: '1px solid rgba(212,175,55,0.3)',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    className="absolute top-0.5 w-6 h-6 rounded-full transition-all"
                    style={{
                      background: '#FAF7F0',
                      left: settings.audio.enabled ? '30px' : '2px',
                    }}
                  />
                </button>
                <span style={{ color: settings.audio.enabled ? '#4ADE80' : '#8B8676' }}>
                  {settings.audio.enabled ? 'مفعّل' : 'مُغلق (افتراضي)'}
                </span>
              </div>

              {/* Reader */}
              <div>
                <label className="block mb-2 font-bold" style={{ color: '#C8C2B0' }}>القارئ:</label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: 'makkah', label: 'الحرم المكي' },
                    { id: 'mishary', label: 'مشاري العفاسي' },
                    { id: 'basit', label: 'عبد الباسط' },
                  ].map(r => (
                    <button
                      key={r.id}
                      onClick={() => setSettings({ ...settings, audio: { ...settings.audio, reader: r.id as any } })}
                      className="px-4 py-2 rounded-lg font-bold"
                      style={{
                        background: settings.audio.reader === r.id ? '#D4AF37' : '#1A5546',
                        color: settings.audio.reader === r.id ? '#0A2E26' : '#C8C2B0',
                        border: '1px solid rgba(212,175,55,0.3)',
                        cursor: 'pointer',
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume */}
              <div>
                <label className="block mb-2 font-bold" style={{ color: '#C8C2B0' }}>
                  مستوى الصوت: {Math.round(settings.audio.volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.audio.volume}
                  onChange={e => setSettings({ ...settings, audio: { ...settings.audio, volume: parseFloat(e.target.value) } })}
                  className="w-full"
                  style={{ accentColor: '#D4AF37' }}
                />
              </div>

              {/* Test button */}
              <button
                onClick={testAudio}
                disabled={testingAudio}
                className="px-6 py-3 rounded-lg font-bold"
                style={{
                  background: testingAudio ? '#1A5546' : 'rgba(212,175,55,0.2)',
                  border: '1px solid #D4AF37',
                  color: '#D4AF37',
                  cursor: testingAudio ? 'not-allowed' : 'pointer',
                }}
              >
                {testingAudio ? '▶ جاري التجربة... (5 ثوان)' : '▶ تجربة (5 ثوان)'}
              </button>
            </div>
          </div>
        )}

        {/* MAINTENANCE */}
        {activeTab === 'maintenance' && (
          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#D4AF37' }}>وضع الصيانة</h2>
            <div className="flex flex-col gap-5 max-w-md">
              <div className="flex items-center gap-4">
                <span className="font-bold" style={{ color: '#F4D03F' }}>تفعيل وضع الصيانة:</span>
                <button
                  onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                  className="relative w-14 h-7 rounded-full transition-all"
                  style={{
                    background: settings.maintenanceMode ? '#FB923C' : '#1A5546',
                    border: '1px solid rgba(212,175,55,0.3)',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    className="absolute top-0.5 w-6 h-6 rounded-full transition-all"
                    style={{
                      background: '#FAF7F0',
                      left: settings.maintenanceMode ? '30px' : '2px',
                    }}
                  />
                </button>
                <span style={{ color: settings.maintenanceMode ? '#FB923C' : '#8B8676' }}>
                  {settings.maintenanceMode ? 'مفعّل ⚠️' : 'مُغلق'}
                </span>
              </div>

              <div>
                <label className="block mb-2 font-bold" style={{ color: '#C8C2B0' }}>رسالة الصيانة:</label>
                <input
                  type="text"
                  value={settings.maintenanceMessage}
                  onChange={e => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                  placeholder="مثال: يُعاد الفتح في الساعة 10 صباحاً"
                  className="w-full px-4 py-2 rounded-lg"
                  style={{ background: '#1A5546', border: '1px solid rgba(212,175,55,0.3)', color: '#FAF7F0', outline: 'none', direction: 'rtl' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ADVANCED */}
        {activeTab === 'advanced' && (
          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#D4AF37' }}>إعدادات متقدمة</h2>
            <div className="flex flex-col gap-5 max-w-lg">
              {/* Zikr toggle */}
              <div className="flex items-center gap-4">
                <span className="font-bold" style={{ color: '#C8C2B0' }}>شريط الأذكار:</span>
                <button
                  onClick={() => setSettings({ ...settings, zikrEnabled: !settings.zikrEnabled })}
                  className="relative w-14 h-7 rounded-full transition-all"
                  style={{ background: settings.zikrEnabled !== false ? '#4ADE80' : '#1A5546', border: '1px solid rgba(212,175,55,0.3)', cursor: 'pointer' }}
                >
                  <span className="absolute top-0.5 w-6 h-6 rounded-full transition-all" style={{ background: '#FAF7F0', left: settings.zikrEnabled !== false ? '30px' : '2px' }} />
                </button>
                <span style={{ color: settings.zikrEnabled !== false ? '#4ADE80' : '#8B8676' }}>
                  {settings.zikrEnabled !== false ? 'مفعّل' : 'مُغلق'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save button */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          className="px-10 py-3 rounded-xl font-bold text-xl transition-all"
          style={{
            background: saved ? '#4ADE80' : '#D4AF37',
            color: '#0A2E26',
            cursor: 'pointer',
            boxShadow: saved ? '0 0 20px rgba(74,222,128,0.3)' : '0 0 20px rgba(212,175,55,0.3)',
          }}
        >
          {saved ? '✓ تم الحفظ' : 'حفظ الإعدادات'}
        </button>
        {saved && (
          <span style={{ color: '#4ADE80', fontFamily: 'Inter' }}>
            Settings saved successfully
          </span>
        )}
      </div>
    </div>
  );
}
