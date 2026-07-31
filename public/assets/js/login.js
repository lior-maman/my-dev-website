// login.js — שולח את פרטי ההתחברות לשרת ושומר את ה-token.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // מונע רענון דף ברירת-מחדל

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('/api/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // שומרים את ה-token תחת המפתח 'jwt' — בדיוק מה ש-admin.js מחפש.
        localStorage.setItem('jwt', data.token);
        alert('התחברת בהצלחה!');
        window.location.href = '/edit'; // מעבר למסך העריכה
      } else {
        alert(data.message || 'התחברות נכשלה');
      }
    } catch (err) {
      console.error(err);
      alert('שגיאת חיבור לשרת');
    }
  });
});
