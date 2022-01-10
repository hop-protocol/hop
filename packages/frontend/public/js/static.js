// google analytics
;(() => {
  ;(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r
    ;(i[r] =
      i[r] ||
      function () {
        ;(i[r].q = i[r].q || []).push(arguments)
      }),
      (i[r].l = 1 * new Date())
    ;(a = s.createElement(o)), (m = s.getElementsByTagName(o)[0])
    a.async = 1
    a.src = g
    m.parentNode.insertBefore(a, m)
  })(
    window,
    document,
    'script',
    'https://www.googletagmanager.com/gtag/js?id=G-ES1R727TH9',
    'ga'
  )

  window.dataLayer = window.dataLayer || []
  function gtag () {
    dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('set', {cookie_flags: 'SameSite=None;Secure'})
  gtag('config', 'G-ES1R727TH9')
})()
