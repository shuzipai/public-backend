const loadableRouter = router =>
  Object.keys(router)
    .sort((a, b) => b.length - a.length)
    .map(key => ({
      key,
      component: router[key]
    }))

export { loadableRouter }
