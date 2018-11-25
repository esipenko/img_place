const cur_url = window.location.href;

console.log('current url: ' + cur_url);
//Видимо браузер что-то себе кэшировал, и загружал этот кэш при переходе на предыдущую страницу
fetch(cur_url, {
  headers: {
    xhr: true
  },
  cache: 'no-store'
}).then(res => {
  if (res.ok) {
    return res.text();
  }
}).then(html => {
  if (html) {
    let parent = document.getElementById("main_field");
    parent.insertAdjacentHTML('beforeend', html);
  } else {
    let para = document.createElement("h1");
    let node = document.createTextNode("Your library is currently empty, lets upload something!!");
    para.appendChild(node);

    let parent = document.getElementById("main_field");

    parent.appendChild(para);

  }
});
