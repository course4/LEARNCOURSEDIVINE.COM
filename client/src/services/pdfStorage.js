// High-Capacity IndexedDB Storage for Course Syllabus PDFs (No 5MB LocalStorage Quota Limit)
const DB_NAME = 'CourseDivine_PDF_DB';
const DB_VERSION = 1;
const STORE_NAME = 'syllabus_pdfs';

const openPdfDB = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => {
      console.warn('IndexedDB PDF open error:', event.target.error);
      resolve(null);
    };
  });
};

export const storePdfInDb = async (key, pdfData, fileName = 'Syllabus.pdf') => {
  if (!key || !pdfData) return false;
  try {
    const db = await openPdfDB();
    if (!db) {
      // Fallback
      sessionStorage.setItem(`cd_pdf_${key}`, pdfData);
      return true;
    }
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({
        key,
        pdfData,
        fileName,
        updatedAt: new Date().toISOString()
      });
      request.onsuccess = () => resolve(true);
      request.onerror = () => {
        try {
          sessionStorage.setItem(`cd_pdf_${key}`, pdfData);
        } catch (e) {}
        resolve(false);
      };
    });
  } catch (err) {
    console.warn('Failed to store PDF in IndexedDB:', err);
    return false;
  }
};

export const getPdfFromDb = async (key) => {
  if (!key) return null;
  try {
    const db = await openPdfDB();
    if (!db) {
      return sessionStorage.getItem(`cd_pdf_${key}`) || null;
    }
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = (event) => {
        const res = event.target.result;
        if (res && res.pdfData) {
          resolve(res);
        } else {
          const sessionVal = sessionStorage.getItem(`cd_pdf_${key}`);
          resolve(sessionVal ? { key, pdfData: sessionVal, fileName: 'Syllabus.pdf' } : null);
        }
      };
      request.onerror = () => {
        const sessionVal = sessionStorage.getItem(`cd_pdf_${key}`);
        resolve(sessionVal ? { key, pdfData: sessionVal, fileName: 'Syllabus.pdf' } : null);
      };
    });
  } catch (err) {
    return null;
  }
};
