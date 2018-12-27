module.exports = app => {
  app.on('pull_request.opened', async context => {
    const filesChanged = await context.github.pullRequests.listFiles(context.issue())
    const results = filesChanged.data.filter(file => file.filename.includes('.md'))
    if (results && results.length > 0) {
      // make URLs
      let urls = ''
      await results.forEach(async (result) => {
        urls += `\n[View rendered ${result.filename}](${context.payload.pull_request.head.repo.html_url}/blob/${context.payload.pull_request.head.ref}/${result.filename})`
      })
      await context.github.pullRequests.update(context.issue({body: `${context.payload.pull_request.body}\n\n-----${urls}`}))
    }
  })
}
