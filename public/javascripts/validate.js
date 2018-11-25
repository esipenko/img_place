function validateForm() {
    var x = document.forms["create_folder"]["folder_name"].value;
    if (x == "") {
        alert("Name must be filled out");
        return false;
    }
    else if (x.match(/[а-яА-ЯЁё]/)){
      alert("Name must comtain only latin symbols");
      return false;
    }
}
