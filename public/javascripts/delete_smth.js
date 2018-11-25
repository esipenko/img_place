function del_smth(clicked_id) {
  const cur_url = window.location.href;
  console.log(clicked_id);
  console.log(cur_url);
  fetch(cur_url + clicked_id, {
    method: 'delete',
    headers: {
      sure: false
    }
  }).then(res => {
    //window.location.reload();
    let resJson = res.json();
    console.log(resJson);
    return resJson;
  }).then(resJson => {
    console.log(resJson.response);
    if (resJson.response === "not empty") { //Если сервер сказал что папка не пуста, то повторить запрос если пользователь согласен
      let result = confirm('Folder is not empty. Are you sure you want to delete it?');
      console.log(result);
      if (result) {
        fetch(cur_url + clicked_id, {
          method: 'delete',
          headers: {
            sure: true
          }
        }).then(res => {
          window.location = window.location;
          return res.json();
        });

      }
    } else window.location = window.location;
  })
}
