// 1. ייבוא של המודל החדש (בנוסף ל-Tour הקיים בשורה 1)
import Tour from '../models/tourModel.js';
import Project from '../models/projectModel.js';

export const getOverview = async (req, res) => {
  try {
    // א) משיכת הנתונים מהדאטה-בייס (עכשיו מושכים את שניהם!)
    const tours = await Tour.find();
    const projects = await Project.find();

    // ב) רינדור התבנית - מעבירים את שניהם ל-Pug
    res.status(200).render('overview', {
      title: 'כל הטיולים והפרויקטים',
      tours,
      projects, // מעכשיו המשתנה הזה זמין בתוך overview.pug
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const getEditPage = async (req, res, next) => {
  // 1) שליפת כל הפרויקטים מתוך בסיס הנתונים
  const projects = await Project.find();

  // 2) רינדור תבנית פאג חדשה שנקרא לה edit.pug
  res.status(200).render('edit', {
    title: 'ניהול פרויקטים',
    projects,
  });
};

export const updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      status: 'success',
      data: { project: updatedProject },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const getProject = async (req, res, next) => {
  try {
    // 1) תופסים את ה-slug מהכתובת בשורת הדפדפן
    const { slug } = req.params;

    // 2) מושכים את הפרויקט מהדאטאבייס (תוודא שמודל ה-Project מיובא בקובץ הזה למעלה)
    // אם לפרויקטים עתידיים אין דף, הבאנו פתרון ל-Pug, אבל כאן נביא את הקיים:
    const project = await Project.findOne({ slug: slug });

    // אם לא נמצא פרויקט
    if (!project) {
      return res.status(404).render('error', {
        title: 'משהו השתבש',
        msg: 'לא נמצא פרויקט עם השם הזה.',
      });
    }

    // 3) מרנדרים את קובץ ה-project.pug ומעבירים לו את הנתונים
    res.status(200).render('project', {
      title: `${project.name} | Project`,
      project, // מעביר את האובייקט כדי שתוכל להשתמש ב-project.name וכו' בתוך ה-Pug
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

export const getTour = async (req, res, next) => {
  try {
    // 1) מציאת הטיול לפי ה-slug מה-URL (כולל חוות דעת ומדריכים אם הגדרת Populating)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
      path: 'reviews',
      fields: 'review rating user',
    });

    if (!tour) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'No tour found with that name' });
    }

    // 2) רנדור הדף עם הנתונים של הטיול הספציפי
    res.status(200).render('tour', {
      title: `${tour.name} Tour`,
      tour: tour,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export default getOverview;
