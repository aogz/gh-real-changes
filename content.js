let totalDeletions = 0, totalAdditions = 0;

setTimeout(() => {
  const diffStat = document.getElementById('diffstat');
  const loadingBlock = document.createElement('span')
  loadingBlock.id = 'loading-block';
  loadingBlock.textContent = `loading 🤔`
  diffStat.prepend(loadingBlock)
  
  const changedFiles = document.querySelectorAll('.file[data-tagsearch-path]')
  for (const file of changedFiles) {
    const path = file.getAttribute('data-tagsearch-path')
    const isDocs = path.includes('docs') || path.endsWith('.md')
    const isTest = path.includes('test') || path.includes('jest') || path.includes('selenium') || path.includes('vitest')
    if (isDocs || isTest) {
      continue
    }
    
    totalAdditions += file.querySelectorAll('.blob-code-addition').length
    totalDeletions += file.querySelectorAll('.blob-code-deletion').length
  }
  
  const diffStatAdditions = diffStat.querySelector('.color-fg-success').textContent.trim()
  const diffStatDeletions = diffStat.querySelector('.color-fg-danger').textContent.trim()
  
  document.getElementById('loading-block').remove()
  if (diffStatAdditions === `+${totalAdditions}` && diffStatDeletions === `−${totalDeletions}`) {
    const realDeletions = document.createElement('span')
    realDeletions.className = 'color-fg-danger'
    realDeletions.textContent = ` no tests? no docs? 🤨 `
    diffStat.prepend(realDeletions)
  } else {
    const divider = document.createElement('span')
    divider.textContent = ' | '
    diffStat.prepend(divider)
    
    const realDeletions = document.createElement('span')
    realDeletions.className = 'color-fg-danger'
    realDeletions.textContent = ` −${totalDeletions} `
    diffStat.prepend(realDeletions)
    
    const realAdditions = document.createElement('span')
    realAdditions.className = 'color-fg-success'
    realAdditions.textContent = ` +${totalAdditions} `
    diffStat.prepend(realAdditions)
  }
}, 2000)