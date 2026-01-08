#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(10)
    prs.slide_height = Inches(7.5)

    # Кольори для дизайну
    BLUE = RGBColor(41, 128, 185)
    DARK_BLUE = RGBColor(52, 73, 94)
    LIGHT_GRAY = RGBColor(236, 240, 241)
    DARK_GRAY = RGBColor(52, 73, 94)
    WHITE = RGBColor(255, 255, 255)
    GREEN = RGBColor(39, 174, 96)

    # === СЛАЙД 1: Титульний ===
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # Blank

    # Фон
    background = slide.shapes.add_shape(
        1,  # Rectangle
        0, 0,
        prs.slide_width, prs.slide_height
    )
    background.fill.solid()
    background.fill.fore_color.rgb = DARK_BLUE
    background.line.fill.background()

    # Заголовок
    title_box = slide.shapes.add_textbox(
        Inches(1), Inches(2),
        Inches(8), Inches(1.5)
    )
    title_frame = title_box.text_frame
    title_frame.text = "📸 Photo Gallery"
    title_para = title_frame.paragraphs[0]
    title_para.font.size = Pt(54)
    title_para.font.bold = True
    title_para.font.color.rgb = WHITE
    title_para.alignment = PP_ALIGN.CENTER

    # Підзаголовок
    subtitle_box = slide.shapes.add_textbox(
        Inches(1), Inches(3.5),
        Inches(8), Inches(1)
    )
    subtitle_frame = subtitle_box.text_frame
    subtitle_frame.text = "Веб-застосунок для пошуку та перегляду фотографій"
    subtitle_para = subtitle_frame.paragraphs[0]
    subtitle_para.font.size = Pt(24)
    subtitle_para.font.color.rgb = LIGHT_GRAY
    subtitle_para.alignment = PP_ALIGN.CENTER

    # Автор
    author_box = slide.shapes.add_textbox(
        Inches(1), Inches(5.5),
        Inches(8), Inches(1.5)
    )
    author_frame = author_box.text_frame
    author_text = "Виконав: Брам Олександр\nГрупа: ОП-221\nОлександрійський політехнічний фаховий коледж\n2026"
    author_frame.text = author_text
    author_para = author_frame.paragraphs[0]
    author_para.font.size = Pt(16)
    author_para.font.color.rgb = LIGHT_GRAY
    author_para.alignment = PP_ALIGN.CENTER

    # === СЛАЙД 2: Опис проєкту ===
    slide = prs.slides.add_slide(prs.slide_layouts[6])

    # Заголовок
    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(0.8))
    tf = title_box.text_frame
    tf.text = "Опис проєкту"
    p = tf.paragraphs[0]
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE

    # Контент
    content_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(8.5), Inches(5))
    tf = content_box.text_frame
    tf.word_wrap = True

    text = """Photo Gallery - інтерактивний веб-застосунок для пошуку та перегляду фотографій з API Unsplash.

🎯 Мета проєкту:
• Створення зручного інтерфейсу для пошуку фотографій
• Практичне застосування сучасних веб-технологій
• Інтеграція з зовнішнім API
• Реалізація адаптивного дизайну

📦 Варіант завдання: №6 - Photo Gallery
Відображення фотографій з API (Unsplash) із можливістю перегляду у повному розмірі та збереження улюблених"""

    tf.text = text
    for paragraph in tf.paragraphs:
        paragraph.font.size = Pt(18)
        paragraph.font.color.rgb = DARK_GRAY
        paragraph.space_after = Pt(12)

    # === СЛАЙД 3: Технічний стек ===
    slide = prs.slides.add_slide(prs.slide_layouts[6])

    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(0.8))
    tf = title_box.text_frame
    tf.text = "Технічний стек"
    p = tf.paragraphs[0]
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE

    # Ліва колонка
    left_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(4), Inches(5))
    tf = left_box.text_frame
    text = """⚡ Інструменти збірки:
• Vite 7.2.4
• npm/Node.js

🎨 Frontend:
• JavaScript ES6+
• HTML5
• CSS3

📚 Бібліотеки:
• Bootstrap 5.3.8
• Axios 1.13.2"""

    tf.text = text
    for paragraph in tf.paragraphs:
        paragraph.font.size = Pt(16)
        paragraph.font.color.rgb = DARK_GRAY
        paragraph.space_after = Pt(10)

    # Права колонка
    right_box = slide.shapes.add_textbox(Inches(5.2), Inches(1.5), Inches(4), Inches(5))
    tf = right_box.text_frame
    text = """🔌 API та сервіси:
• Unsplash API
• REST API

💾 Зберігання даних:
• localStorage
• JSON

🛠 Інструменти розробки:
• Git/GitHub
• VS Code
• Chrome DevTools"""

    tf.text = text
    for paragraph in tf.paragraphs:
        paragraph.font.size = Pt(16)
        paragraph.font.color.rgb = DARK_GRAY
        paragraph.space_after = Pt(10)

    # === СЛАЙД 4: Функціональність (1) ===
    slide = prs.slides.add_slide(prs.slide_layouts[6])

    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(0.8))
    tf = title_box.text_frame
    tf.text = "Основна функціональність"
    p = tf.paragraphs[0]
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE

    content_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(8.5), Inches(5.5))
    tf = content_box.text_frame
    text = """🔍 Пошук фотографій
• Пошук за ключовими словами
• Валідація форми введення
• Миттєве відображення результатів

🗂 Категорії
• 11 популярних категорій (Nature, Architecture, Travel...)
• Горизонтальна прокрутка
• Швидкий доступ одним кліком

🔄 Сортування
• За релевантністю (за замовчуванням)
• Від найпопулярніших ⬇️
• Від найновіших 🕒"""

    tf.text = text
    for paragraph in tf.paragraphs:
        paragraph.font.size = Pt(18)
        paragraph.font.color.rgb = DARK_GRAY
        paragraph.space_after = Pt(14)

    # === СЛАЙД 5: Функціональність (2) ===
    slide = prs.slides.add_slide(prs.slide_layouts[6])

    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(0.8))
    tf = title_box.text_frame
    tf.text = "Розширена функціональність"
    p = tf.paragraphs[0]
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE

    content_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(8.5), Inches(5.5))
    tf = content_box.text_frame
    text = """📄 Три режими завантаження:
• Пагінація з номерами сторінок
• Кнопка "Завантажити більше"
• Infinite Scroll (нескінченний скрол)

❤️ Система улюблених
• Збереження фото в localStorage
• Фільтрація за мінімальною кількістю лайків
• Окрема вкладка для перегляду

🖼 Перегляд у повному розмірі
• Модальне вікно Bootstrap
• Деталі про фото та автора
• Посилання на оригінал на Unsplash"""

    tf.text = text
    for paragraph in tf.paragraphs:
        paragraph.font.size = Pt(18)
        paragraph.font.color.rgb = DARK_GRAY
        paragraph.space_after = Pt(14)

    # === СЛАЙД 6: Архітектура ===
    slide = prs.slides.add_slide(prs.slide_layouts[6])

    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(0.8))
    tf = title_box.text_frame
    tf.text = "Модульна архітектура"
    p = tf.paragraphs[0]
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE

    content_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(8.5), Inches(5.5))
    tf = content_box.text_frame
    text = """Проєкт організовано за принципом розділення відповідальностей:

📁 src/config.js - конфігурація API ключів
📁 src/state.js - глобальний стан застосунку
📁 src/dom.js - посилання на DOM елементи
📁 src/storage.js - робота з localStorage
📁 src/api.js - HTTP запити до Unsplash API
📁 src/ui.js - функції відображення інтерфейсу
📁 src/events.js - обробники подій
📁 src/main.js - точка входу, ініціалізація

✅ Переваги модульної архітектури:
• Легко підтримувати та розширювати
• Чистий та організований код
• Можливість повторного використання"""

    tf.text = text
    for paragraph in tf.paragraphs:
        paragraph.font.size = Pt(16)
        paragraph.font.color.rgb = DARK_GRAY
        paragraph.space_after = Pt(10)

    # === СЛАЙД 7: Реалізовані теми практики ===
    slide = prs.slides.add_slide(prs.slide_layouts[6])

    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(0.8))
    tf = title_box.text_frame
    tf.text = "Реалізовані теми практики"
    p = tf.paragraphs[0]
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE

    # Ліва колонка
    left_box = slide.shapes.add_textbox(Inches(0.6), Inches(1.5), Inches(4.5), Inches(5.5))
    tf = left_box.text_frame
    text = """✅ Створення WEB-проєкту
   (Vite, Git, HTML)

✅ Робота з DOM-деревом
   (createElement, appendChild)

✅ Обробка подій
   (submit, click, scroll)

✅ Масиви та об'єкти
   (forEach, find, filter)

✅ HTML-форми та валідація
   (required, trim())

✅ Bootstrap та Axios
   (Modal, Navbar, HTTP)"""

    tf.text = text
    for paragraph in tf.paragraphs:
        paragraph.font.size = Pt(14)
        paragraph.font.color.rgb = DARK_GRAY
        paragraph.space_after = Pt(8)

    # Права колонка
    right_box = slide.shapes.add_textbox(Inches(5.2), Inches(1.5), Inches(4.5), Inches(5.5))
    tf = right_box.text_frame
    text = """✅ Взаємодія з API
   (Unsplash, JSON, async)

✅ Обробка помилок
   (try-catch, типи помилок)

✅ Пагінація та скрол
   (infinite scroll, debounce)

✅ localStorage
   (JSON.stringify/parse)

✅ Налагодження
   (Chrome DevTools)

✅ Підготовка до публікації
   (build, deploy)"""

    tf.text = text
    for paragraph in tf.paragraphs:
        paragraph.font.size = Pt(14)
        paragraph.font.color.rgb = DARK_GRAY
        paragraph.space_after = Pt(8)

    # === СЛАЙД 8: Особливості реалізації ===
    slide = prs.slides.add_slide(prs.slide_layouts[6])

    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(0.8))
    tf = title_box.text_frame
    tf.text = "Особливості реалізації"
    p = tf.paragraphs[0]
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE

    content_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(8.5), Inches(5.5))
    tf = content_box.text_frame
    text = """🎯 Делегування подій (Event Delegation)
Один обробник на контейнері галереї замість окремих на кожній картці
→ Економія пам'яті та кращу продуктивність

⏱ Debouncing для оптимізації
Затримка 200мс для scroll, 500мс для фільтрів
→ Запобігання надмірним запитам до API

📱 Адаптивний дизайн
Bootstrap Grid: 3 колонки (desktop), 2 (tablet), 1 (mobile)
→ Коректне відображення на всіх пристроях

🔄 Spread оператор для immutability
state.photos = [...state.photos, ...newPhotos]
→ Immutable підхід до роботи з даними

✨ Lazy loading зображень
<img loading="lazy" />
→ Швидше завантаження сторінки"""

    tf.text = text
    for paragraph in tf.paragraphs:
        paragraph.font.size = Pt(15)
        paragraph.font.color.rgb = DARK_GRAY
        paragraph.space_after = Pt(10)

    # === СЛАЙД 9: Код - API запити ===
    slide = prs.slides.add_slide(prs.slide_layouts[6])

    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(0.8))
    tf = title_box.text_frame
    tf.text = "Приклад коду: API запити"
    p = tf.paragraphs[0]
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE

    code_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(8.5), Inches(5.5))
    tf = code_box.text_frame
    code = """export async function fetchPhotos(query, page) {
  try {
    const response = await axios.get(
      `${UNSPLASH_API_URL}/search/photos`,
      {
        params: {
          query: query,
          page: page,
          per_page: 12,
          client_id: UNSPLASH_ACCESS_KEY
        }
      }
    )

    return response.data.results
  } catch (error) {
    handleError(error)
    return []
  }
}"""

    tf.text = code
    for paragraph in tf.paragraphs:
        paragraph.font.name = 'Courier New'
        paragraph.font.size = Pt(15)
        paragraph.font.color.rgb = DARK_GRAY

    # === СЛАЙД 10: Обробка помилок ===
    slide = prs.slides.add_slide(prs.slide_layouts[6])

    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(0.8))
    tf = title_box.text_frame
    tf.text = "Обробка помилок"
    p = tf.paragraphs[0]
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE

    content_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(8.5), Inches(5.5))
    tf = content_box.text_frame
    text = """Реалізовано комплексну систему обробки помилок:

⚠️ Помилки API:
• 401 Unauthorized → "Невірний API ключ"
• 403 Forbidden → "Перевищено ліміт запитів"
• Інші коди → "Помилка API: {status}"

🌐 Помилки мережі:
• Відсутність з'єднання → "Помилка мережі"
• Timeout → "Час очікування вичерпано"

✏️ Помилки валідації:
• Порожній запит → "Введіть пошуковий запит"

💾 Помилки localStorage:
• Недоступний → "Не вдалося зберегти"

Всі помилки показуються через Bootstrap Alert"""

    tf.text = text
    for paragraph in tf.paragraphs:
        paragraph.font.size = Pt(16)
        paragraph.font.color.rgb = DARK_GRAY
        paragraph.space_after = Pt(10)

    # === СЛАЙД 11: Результати ===
    slide = prs.slides.add_slide(prs.slide_layouts[6])

    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(0.8))
    tf = title_box.text_frame
    tf.text = "Результати та досягнення"
    p = tf.paragraphs[0]
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE

    content_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(8.5), Inches(5.5))
    tf = content_box.text_frame
    text = """✅ Повністю реалізовані всі 12+ тем практики

✅ Модульна архітектура з 8 окремих файлів

✅ Інтеграція з реальним API (Unsplash)

✅ Три різні режими завантаження даних

✅ Адаптивний дизайн для всіх пристроїв

✅ Система збереження улюблених фото

✅ Професійна обробка помилок

✅ Оптимізація продуктивності (debouncing, lazy loading)

✅ Готовність до deployment (build configuration)"""

    tf.text = text
    for paragraph in tf.paragraphs:
        paragraph.font.size = Pt(18)
        paragraph.font.color.rgb = GREEN
        paragraph.font.bold = True
        paragraph.space_after = Pt(12)

    # === СЛАЙД 12: Демонстрація ===
    slide = prs.slides.add_slide(prs.slide_layouts[6])

    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(0.8))
    tf = title_box.text_frame
    tf.text = "Демонстрація застосунку"
    p = tf.paragraphs[0]
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE

    content_box = slide.shapes.add_textbox(Inches(1.5), Inches(2), Inches(7), Inches(4))
    tf = content_box.text_frame
    text = """🚀 Як запустити проєкт:

1. git clone https://github.com/AlexBram003/Practika
2. cd Practika
3. npm install
4. npm run dev

📱 Відкрити: http://localhost:5173

💡 Спробуйте:
• Пошук: "nature", "city", "architecture"
• Клік на категорію
• Додати фото до улюблених
• Змінити режим завантаження"""

    tf.text = text
    for paragraph in tf.paragraphs:
        paragraph.font.size = Pt(20)
        paragraph.font.color.rgb = DARK_GRAY
        paragraph.space_after = Pt(14)

    # === СЛАЙД 13: Висновки ===
    slide = prs.slides.add_slide(prs.slide_layouts[6])

    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(0.8))
    tf = title_box.text_frame
    tf.text = "Висновки"
    p = tf.paragraphs[0]
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE

    content_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(8.5), Inches(5.5))
    tf = content_box.text_frame
    text = """В результаті виконання навчальної практики:

📚 Набуто практичні навички:
• Робота з сучасними інструментами (Vite, Axios, Bootstrap)
• Інтеграція з зовнішніми API
• Модульна розробка JavaScript застосунків
• Асинхронне програмування та обробка помилок

💼 Професійний розвиток:
• Створено портфоліо проєкт
• Досвід роботи з Git/GitHub
• Практика адаптивного дизайну
• UX/UI best practices

🎯 Практична цінність:
Проєкт демонструє готовність до реальної веб-розробки
та може бути використаний як приклад для роботодавців"""

    tf.text = text
    for paragraph in tf.paragraphs:
        paragraph.font.size = Pt(17)
        paragraph.font.color.rgb = DARK_GRAY
        paragraph.space_after = Pt(12)

    # === СЛАЙД 14: Дякую ===
    slide = prs.slides.add_slide(prs.slide_layouts[6])

    # Фон
    background = slide.shapes.add_shape(
        1, 0, 0,
        prs.slide_width, prs.slide_height
    )
    background.fill.solid()
    background.fill.fore_color.rgb = BLUE
    background.line.fill.background()

    # Текст
    thanks_box = slide.shapes.add_textbox(
        Inches(1), Inches(2.5),
        Inches(8), Inches(2)
    )
    tf = thanks_box.text_frame
    tf.text = "Дякую за увагу!"
    p = tf.paragraphs[0]
    p.font.size = Pt(60)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.alignment = PP_ALIGN.CENTER

    # Контакти
    contact_box = slide.shapes.add_textbox(
        Inches(1), Inches(5),
        Inches(8), Inches(1.5)
    )
    tf = contact_box.text_frame
    tf.text = "📧 Питання?\n\n📸 Photo Gallery - Брам Олександр, ОП-221"
    for paragraph in tf.paragraphs:
        paragraph.font.size = Pt(20)
        paragraph.font.color.rgb = WHITE
        paragraph.alignment = PP_ALIGN.CENTER

    return prs

if __name__ == "__main__":
    print("Створення презентації...")
    prs = create_presentation()
    prs.save('Photo_Gallery_Презентація.pptx')
    print("✅ Презентацію збережено: Photo_Gallery_Презентація.pptx")
