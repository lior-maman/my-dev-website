document.addEventListener('DOMContentLoaded', () => {
  // בדיקה האם המשתמש נמצא כרגע בכתובת של דף העריכה
  const isEditPage = window.location.pathname === '/edit';

  // אם אנחנו בדף העריכה - נפעיל את מנגנון האבטחה והשמירה
  if (isEditPage) {
    // 1. הגנה מיידית: מחביאים את כל ה-Wrapper של דף העריכה בשנייה שהוא נטען
    const wrapper = document.getElementById('wrapper');
    if (wrapper) wrapper.style.display = 'none';

    // 2. מקפיצים פרומפט לבדיקת אימייל וסיסמה
    const email = prompt('הכנס אימייל מנהל לפאנל העריכה:');
    const password = prompt('הכנס סיסמה:');

    // 3. בדיקת אימות מקומי
    if (email === 'lior.maman.ai@gmail.com' && password === '1234') {
      alert('מצב עריכה פעיל למנהל!');
      if (wrapper) wrapper.style.display = 'block'; // חשיפת הדף למנהל
    } else {
      alert('פרטים שגויים. גישה נדחתה!');
      window.location.href = '/'; // זריקת המשתמש חזרה לדף הבית
      return;
    }
  }

  // ==========================================
  // לוגיקת שמירת השינויים בכרטיסיות (MongoDB)
  // ==========================================
  // הקוד הזה ירוץ ויקשיב לכפתורים רק אם הם קיימים על המסך (בדף העריכה)
  const saveButtons = document.querySelectorAll('.btn-save-project');

  saveButtons.forEach((button) => {
    button.addEventListener('click', async (e) => {
      const card = e.target.closest('.card');
      if (!card) return;

      const projectId = card.getAttribute('data-project-id');
      const nameField = card.querySelector('.project-name-input');
      const summaryField = card.querySelector('.project-summary-input');

      const updatedData = {
        name: nameField ? nameField.value.trim() : undefined,
        summary: summaryField ? summaryField.value.trim() : undefined,
      };

      try {
        button.innerText = 'שומר... ⏳';
        button.disabled = true;

        const response = await fetch(`/api/v1/projects/${projectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });

        if (response.ok) {
          alert('הפרויקט עודכן בהצלחה בבסיס הנתונים!');
        } else {
          const errData = await response.json();
          alert(`העדכון נכשל: ${errData.message || 'שגיאת שרת'}`);
        }
      } catch (err) {
        console.error(`שגיאה בעדכון פרויקט ${projectId}:`, err);
        alert('חיבור השרת נכשל.');
      } finally {
        button.innerText = 'שמור שינויים 💾';
        button.disabled = false;
      }
    });
  });
});
