// ==========================================
// אימות אדמין + שמירת שינויים (דף /edit)
// ==========================================
// האבטחה האמיתית נאכפת בשרת (protect + restrictTo('admin') על
// /api/v1/projects). קובץ זה רק (א) מוודא שיש token תקין לפני שמציג
// את מסך העריכה, ו-(ב) מצרף את ה-token לכל בקשת שמירה. אין כאן שום
// סיסמה קשיחה — ההחלטה מי אדמין מתקבלת בשרת מול ה-JWT.

document.addEventListener('DOMContentLoaded', () => {
  const TOKEN_KEY = 'jwt';

  const getToken = () => localStorage.getItem(TOKEN_KEY);

  // הפניה לדף ההתחברות, עם חזרה ל-/edit אחרי לוגין מוצלח.
  const redirectToLogin = () => {
    window.location.href = '/login?redirect=/edit';
  };

  const isEditPage = window.location.pathname === '/edit';

  if (isEditPage) {
    const wrapper = document.getElementById('wrapper');

    // הגנה ויזואלית מיידית: מסתירים עד שנוודא token. זו אינה האבטחה
    // עצמה (השרת אוכף), רק מונע הבזק של המסך למי שאינו מחובר.
    if (wrapper) wrapper.style.display = 'none';

    const token = getToken();

    if (!token) {
      // אין token — אין מה להציג. לדף ההתחברות.
      redirectToLogin();
      return;
    }

    // יש token: נחשוף את המסך. אם ה-token פג/לא של אדמין, בקשת
    // ה-PATCH הראשונה תיכשל עם 401/403 ותחזיר אותנו ללוגין.
    if (wrapper) wrapper.style.display = 'block';
  }

  // ==========================================
  // לוגיקת שמירת השינויים בכרטיסיות (MongoDB)
  // ==========================================
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

      const token = getToken();

      if (!token) {
        alert('פג תוקף החיבור. יש להתחבר מחדש.');
        redirectToLogin();
        return;
      }

      try {
        button.innerText = 'שומר... ⏳';
        button.disabled = true;

        const response = await fetch(`/api/v1/projects/${projectId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            // צירוף ה-JWT — כך protect בשרת מזהה שאתה אדמין מחובר.
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        });

        if (response.ok) {
          alert('הפרויקט עודכן בהצלחה בבסיס הנתונים!');
        } else if (response.status === 401) {
          // token פג או לא תקין.
          alert('החיבור אינו תקף. יש להתחבר מחדש.');
          redirectToLogin();
        } else if (response.status === 403) {
          // מחובר, אבל לא אדמין.
          alert('אין לך הרשאת עריכה.');
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
