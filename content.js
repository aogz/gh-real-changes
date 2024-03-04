document.onkeydown = function (e) {
  if (e.ctrlKey && e.altKey && e.key === "c") {
    let totalDeletions = 0, totalAdditions = 0;
    
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

    const diffStat = document.getElementById('diffstat');
    const diffStatAdditions = diffStat.querySelector('.color-fg-success').textContent.trim()
    const diffStatDeletions = diffStat.querySelector('.color-fg-danger').textContent.trim()
    let text = "";
    const popupContent = document.createElement('div');
    if (diffStatAdditions === `+${totalAdditions}` && diffStatDeletions === `−${totalDeletions}`) {
      text = `no tests or docs? 🤨`
      popupContent.innerHTML = text;
    } else {
      const divider = document.createElement('span')
      popupContent.appendChild(divider)
      
      const realDeletions = document.createElement('span')
      realDeletions.className = 'color-fg-danger'
      realDeletions.textContent = ` −${totalDeletions} `
      popupContent.prepend(realDeletions)
      
      const realAdditions = document.createElement('span')
      realAdditions.className = 'color-fg-success'
      realAdditions.textContent = ` +${totalAdditions} `
      popupContent.prepend(realAdditions)
    }
    
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    popup.style.borderRadius = '12px';
    popup.style.opacity = '0.8';
    popup.style.color = 'white';
    popup.style.fontSize = '24px';
    popup.style.padding = '16px';
    popup.appendChild(popupContent);
    document.body.appendChild(popup);
    
    setTimeout(() => {
      popup.remove();
    }, 3000);
  }
}