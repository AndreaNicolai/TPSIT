// UTENTE ATTIVO
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

// UTENTI
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// POST
function getPosts() {
  return JSON.parse(localStorage.getItem("posts")) || [];
}

// INDEX
if (document.getElementById("posts")) {
  const postsDiv = document.getElementById("posts");
  const welcome = document.getElementById("welcome");
  const postForm = document.getElementById("postForm");
  const loginAlert = document.getElementById("loginAlert");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginBtn = document.getElementById("loginBtn");

  if (currentUser) {
    welcome.innerText = `Benvenuto, ${currentUser.username}!`;
    postForm.classList.remove("d-none");
    logoutBtn.classList.remove("d-none");
    loginBtn.classList.add("d-none");
  } else {
    loginAlert.classList.remove("d-none");
  }

  function renderPosts() {
    postsDiv.innerHTML = "";
    getPosts().forEach(p => {
      postsDiv.innerHTML += `
        <div class="card mb-2">
          <div class="card-header">${p.username} - ${p.date}</div>
          <div class="card-body">${p.content}</div>
        </div>`;
    });
  }

  renderPosts();

  postForm?.addEventListener("submit", e => {
    e.preventDefault();
    const posts = getPosts();
    posts.unshift({
      username: currentUser.username,
      content: content.value,
      date: new Date().toLocaleString()
    });
    localStorage.setItem("posts", JSON.stringify(posts));
    content.value = "";
    renderPosts();
  });

  logoutBtn.onclick = () => {
    localStorage.removeItem("currentUser");
    location.reload();
  };
}

// LOGIN
document.getElementById("loginForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const users = getUsers();
  const u = users.find(u =>
    u.username === username.value &&
    u.password === password.value
  );

  if (!u) return alert("Credenziali errate");

  localStorage.setItem("currentUser", JSON.stringify(u));
  location.href = "index.html";
});

// SIGNUP
document.getElementById("signupForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const users = getUsers();

  if (users.find(u => u.username === username.value))
    return alert("Username già esistente");

  users.push({ username: username.value, password: password.value });
  localStorage.setItem("users", JSON.stringify(users));
  location.href = "login.html";
});
