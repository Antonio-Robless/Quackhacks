// Stores and retrieves the student profile across pages
export const StudentProfile = {
  save(year, topics) {
    localStorage.setItem('fil_year', year)
    localStorage.setItem('fil_topics', JSON.stringify(topics))
  },
  getYear() {
    return localStorage.getItem('fil_year') || 'college student'
  },
  getTopics() {
    try {
      return JSON.parse(localStorage.getItem('fil_topics')) || []
    } catch {
      return []
    }
  },
  clear() {
    localStorage.removeItem('fil_year')
    localStorage.removeItem('fil_topics')
  }
}
