// Stores and retrieves the student profile across pages
export const StudentProfile = {
  save(year, topics, college) {
    localStorage.setItem('fil_year', year)
    localStorage.setItem('fil_topics', JSON.stringify(topics))
    localStorage.setItem('fil_college', college)
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
  getCollege() {
    return localStorage.getItem('fil_college') || ''
  },
  clear() {
    localStorage.removeItem('fil_year')
    localStorage.removeItem('fil_topics')
    localStorage.removeItem('fil_college')
  }
}
