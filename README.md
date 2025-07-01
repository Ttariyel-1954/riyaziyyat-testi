# riyaziyyat-testi
Riyaziyyat testi - Google Sheets inteqrasiyası ilə
# 🧮 Riyaziyyat Testi Sistemi

Müasir və interaktiv riyaziyyat testi sistemi - Google Sheets inteqrasiyası ilə avtomatik nəticə qeydiyyatı.

## 🚀 Canlı Demo

- **🎯 Test Keç**: [https://SİZİN_USERNAME.github.io/riyaziyyat-testi/](https://SİZİN_USERNAME.github.io/riyaziyyat-testi/)
- **📊 Nəticələr Dashboard**: [https://SİZİN_USERNAME.github.io/riyaziyyat-testi/dashboard.html](https://SİZİN_USERNAME.github.io/riyaziyyat-testi/dashboard.html)

## ✨ Xüsusiyyətlər

- 🎨 **Müasir UI/UX**: Responsive dizayn, animasiyalar
- ⏰ **10 dəqiqəlik timer**: Avtomatik təslim etmə
- 📊 **Real-time proqres**: Cavablandırılan sualların izlənməsi
- 📋 **Google Sheets inteqrasiyası**: Avtomatik nəticə qeydiyyatı
- 📈 **Dashboard**: Nəticələrin analizi və statistika
- 📱 **Mobil uyğun**: Bütün cihazlarda mükəmməl işləyir

## 🎯 Test Məzmunu

- **10 riyaziyyat sualı**: Əsas riyazi əməliyyatlar
- **Çoxvariantlı cavablar**: Hər sual üçün 4 variant
- **Vizual suallar**: SVG diaqramları ilə geometrik suallar
- **Avtomatik qiymətləndirmə**: Dərhal nəticə və analiz

## 🛠️ Quraşdırma

### 1. Google Apps Script Quraşdırması

1. [script.google.com](https://script.google.com) açın
2. "New project" yaradın
3. `docs/apps-script.js` faylındakı kodu kopyalayın
4. `SPREADSHEET_ID`-ni öz Google Sheets ID-nizlə dəyişin
5. Deploy → New deployment → Web app
6. Execute as: "Me", Who has access: "Anyone"
7. URL-i kopyalayın

### 2. HTML Fayllarını Düzəltmək

1. `index.html`-də `APPS_SCRIPT_URL`-ni yeni URL ilə dəyişin
2. `dashboard.html`-də `SHEET_ID`-ni sizin ID ilə dəyişin

### 3. GitHub Pages Aktivləşdirmək

1. Repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: / (root)
5. Save

## 📊 Google Sheets Strukturu

| Tarix | Ad Soyad | Məktəb | Sinif | Ümumi Xal | S1 Sual | S1 Cavab | ... |
|-------|----------|--------|-------|-----------|---------|----------|-----|
| 01.07.2025 | Məmməd Əliyev | 1 saylı məktəb | 5A | 8 | 2+3=? | 5 | ... |

## 🎮 İstifadə

### Tələbələr üçün:
1. Test linkini açın
2. Ad, məktəb və sinif məlumatlarını daxil edin
3. 10 dəqiqə ərzində sualları cavablandırın
4. Nəticənizi dərhal görün

### Müəllimlər üçün:
1. Dashboard linkini açın
2. Bütün nəticələri real-time görün
3. Statistikaları analiz edin
4. CSV formatında export edin

## 🔧 Texniki Detallar

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Backend**: Google Apps Script
- **Verilənlər bazası**: Google Sheets
- **Hosting**: GitHub Pages
- **Responsive**: Bootstrap-free, pure CSS Grid/Flexbox

## 📷 Ekran Görüntüləri

### Test İnterfeysi
![Test Interface](screenshots/test-interface.png)

### Nəticələr Dashboard
![Dashboard](screenshots/dashboard.png)

### Mobil Görünüş
![Mobile View](screenshots/mobile-view.png)

## 🤝 Töhfə Vermək

1. Repository-ni fork edin
2. Feature branch yaradın (`git checkout -b yeni-feature`)
3. Dəyişikliklərinizi commit edin (`git commit -am 'Yeni feature əlavə edildi'`)
4. Branch-i push edin (`git push origin yeni-feature`)
5. Pull Request açın

## 📋 TODO

- [ ] Daha çox sual növləri əlavə etmək
- [ ] Müxtəlif çətinlik səviyyələri
- [ ] PDF nəticə eksportu
- [ ] Email bildirişləri
- [ ] Çoxdilli dəstək

## 📞 Dəstək

Problem və ya suallarınız varsa:
- GitHub Issues açın
- Email: [sizin@email.com](mailto:sizin@email.com)

## 📜 Lisenziya

Bu layihə MIT lisenziyası altında yayımlanır. Ətraflı məlumat üçün [LICENSE](LICENSE) faylına baxın.

## 🙏 Təşəkkürlər

- Google Apps Script komandası
- GitHub Pages hosting
- Bütün töhfə verənlər

---

**📊 Statistika**: ![GitHub stars](https://img.shields.io/github/stars/SİZİN_USERNAME/riyaziyyat-testi) ![GitHub forks](https://img.shields.io/github/forks/SİZİN_USERNAME/riyaziyyat-testi) ![GitHub issues](https://img.shields.io/github/issues/SİZİN_USERNAME/riyaziyyat-testi)

**🔄 Son yeniləmə**: 1 iyul 2025
