export default function useFormatters () {
  
  function dateFormat (date?: string, includeTime = false) {
    if (!date) return ''
    
    const d = new Date(date)
    
    // invalid date
    if (isNaN(d.getTime())) return ''
    
    const settings: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }
    
    if (includeTime) {
      settings['hour'] = '2-digit'
      settings['minute'] = '2-digit'
    }
    
    // format date using Intl
    return new Intl.DateTimeFormat('it-IT', settings).format(d)
  }
  
  return {
    dateFormat
  }
}
