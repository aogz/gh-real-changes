function calculateChangedLines () {
  let totalDeletions = 0, totalAdditions = 0;

  const diffStat = document.getElementById('diffstat');
  const loadingBlock = document.createElement('span')
  loadingBlock.id = 'loading-block';
  loadingBlock.textContent = `loading...`
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
    realDeletions.textContent = ` no tests or docs?🤨 `
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
}

function waitForTurboFrame(turboFrameSelector) {
  return new Promise(resolve => {
      if (document.querySelector(turboFrameSelector)) {
          return resolve(document.querySelector(turboFrameSelector));
      }

      const observer = new MutationObserver(mutations => {
          if (document.querySelector(turboFrameSelector)) {
              observer.disconnect();
              resolve(document.querySelector(turboFrameSelector));
          }
      });

      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
  });
}


function start(turboFrameSelector) {
  const turboFrame = document.querySelector(turboFrameSelector)
  if (!turboFrame && !window.location.href.endsWith("/files")) {
    return waitForTurboFrame(turboFrameSelector).then((resolvedTurboFrame) => {
      calculateWhenAvailable(resolvedTurboFrame)
    })
  }

  calculateWhenAvailable(turboFrame)
}

function isInFilesTab(turboFrame) {
  return turboFrame.getAttribute("src").endsWith("/files") || window.location.href.endsWith("/files")
}


function calculateWhenAvailable(turboFrame) {
  if (isInFilesTab(turboFrame)) {
    calculateChangedLines()
  }

  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "attributes") {
        if (mutation.attributeName === "complete" && isInFilesTab(turboFrame)) {
          calculateChangedLines()
        }
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(turboFrame, { attributes: true });
}

start("turbo-frame[src]")