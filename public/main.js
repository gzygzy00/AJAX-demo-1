console.log(666)

getCSS.onclick = () => {
  const request = new XMLHttpRequest()
  request.open('GET', '/style.css')
  request.onload = () => {
    console.log('request response:')
    console.log(request.response)

    const style = document.createElement('style')
    style.innerHTML = request.response
    document.head.appendChild(style)
  }
  request.onerror = () => {
    console.log('fail')
  }
  request.send()
}

getJS.onclick = () => {
  const request = new XMLHttpRequest()
  request.open('GET', '/part1.js')
  request.onload = () => {
    // console.log('request response:')
    // console.log(request.response)

    const script = document.createElement('script')
    script.innerHTML = request.response
    document.body.appendChild(script)
  }
  request.onerror = () => {
    console.log('fail')
  }
  request.send()
}

getHTML.onclick = () => {
  const request = new XMLHttpRequest()
  request.open('GET', '/part2.html')
  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      if (request.status >= 200 && request.status < 300) {
        const div = document.createElement('div')
        div.innerHTML = request.response
        document.body.appendChild(div)
      } else {
        alert('加载失败')
      }
    }
  }
  request.send()
}

getXML.onclick = () => {
  const request = new XMLHttpRequest()
  request.open('GET', '/part3.xml')
  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      if (request.status >= 200 && request.status < 300) {
        const dom = request.responseXML
        const text = dom.getElementsByTagName('warning')[0].textContent
        console.log(text.trim())
      }
    }
  }
  request.send()
}

getJSON.onclick = () => {
  const request = new XMLHttpRequest()
  request.open('GET', '/part4.json')
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      console.log(request.response)
      const object = JSON.parse(request.response)
      console.log(object)
      // JSON 有6种数据结构 不一定是对象
      // string number boolean Object Array null
      age.textContent = object.age
      animal.textContent = object.animal
    }
  }
  request.send()
}

let n = 2
getPage.onclick = () => {
  const request = new XMLHttpRequest()
  request.open('GET', `/page${n}.json`)
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      const array = JSON.parse(request.response)
      array.forEach(item => {
        const li = document.createElement('li')
        li.textContent = item.id
        pages.appendChild(li)
      })
      n += 1
    }
  }
  request.send()
}