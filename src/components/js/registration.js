import login from './login';
export default function regRequest(formRef, notifWrap) {
    let form = new FormData(formRef.current);
    form.delete('password-repeat');

    fetch('http://127.0.0.1:8000/user/create/', {
        method: 'POST',
        body: form
    })
        .then(response => {
            response.json().then(json => {
                new Promise(function (resolve, reject) {
                    if (response.status === 201) {
                        notificate('Успешная регистрация!', notifWrap, 'success');
                        resolve()
                    } else {
                        reject()
                    }
                })
                    .then(() => {
                        let loginForm = new FormData();
                        loginForm.append('login', form.get('login'));
                        loginForm.append('password', form.get('password'));
                        loginForm.append('isRemember', form.get('isRemember'));
                        login(loginForm, notifWrap); // авторизация после регистрации
                    })
                    .catch(() => { // ошибка при регистрации
                        if (json.username || json.errors !== 0) {
                            notificate('Пользователь с таким ником уже существует!', notifWrap, 'warn');
                            formRef.current.elements['login'].value = '';
                        } else {
                            console.log(json);
                            notificate('Неизвестная ошибка! Проверьте корректность введённых данных!', notifWrap, 'error');
                        }
                    });
            });
        })
        .catch(() => notificate('Ошибка сервера при регистрации', notifWrap, 'error'));
}