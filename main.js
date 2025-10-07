// main.js
// Form validation (contact form)
// Dynamic blog (LocalStorage)

// ---------- Contact Form Validation ----------
const contactForm = document.getElementById('contactForm');
if(contactForm){
  const nameEl = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const phoneEl = document.getElementById('phone');
  const messageEl = document.getElementById('message');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');
  const messageError = document.getElementById('messageError');
  const formSuccess = document.getElementById('formSuccess');

  function validateEmail(email){
    // Simple email regex
    return /^\S+@\S+\.\S+$/.test(email);
  }

  function validatePhone(phone){
    // Accepts international with + and 7-15 digits, spaces and dashes allowed
    return /^[+]?([0-9][- ]?){7,15}$/.test(phone);
  }

  contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    let ok = true;
    // Name
    if(!nameEl.value.trim()){
      nameError.textContent = 'Name is required'; ok = false;
    } else { nameError.textContent = '' }

    // Email
    if(!emailEl.value.trim()){
      emailError.textContent = 'Email is required'; ok = false;
    } else if(!validateEmail(emailEl.value.trim())){
      emailError.textContent = 'Enter a valid email'; ok = false;
    } else { emailError.textContent = '' }

    // Phone
    if(!phoneEl.value.trim()){
      phoneError.textContent = 'Phone is required'; ok = false;
    } else if(!validatePhone(phoneEl.value.trim())){
      phoneError.textContent = 'Enter a valid phone number'; ok = false;
    } else { phoneError.textContent = '' }

    // Message
    if(!messageEl.value.trim()){
      messageError.textContent = 'Message cannot be empty'; ok = false;
    } else { messageError.textContent = '' }

    if(ok){
      // In a real app you'd send to server; here we'll just show success
      formSuccess.textContent = 'Message sent — thanks! (Demo only)';
      contactForm.reset();
      setTimeout(()=> formSuccess.textContent = '', 4000);
    }
  });
}

// ---------- Blog: add/delete posts using LocalStorage ----------
const blogForm = document.getElementById('blogForm');
const postsContainer = document.getElementById('posts');

function getPosts(){
  try{
    const raw = localStorage.getItem('posts');
    return raw ? JSON.parse(raw) : [];
  }catch(e){return []}
}

function savePosts(posts){
  localStorage.setItem('posts', JSON.stringify(posts));
}

function renderPosts(){
  const posts = getPosts();
  postsContainer.innerHTML = '';
  if(posts.length === 0){
    postsContainer.innerHTML = '<p>No posts yet. Add one above.</p>';
    return;
  }
  posts.slice().reverse().forEach((p, idx)=>{
    const div = document.createElement('div');
    div.className = 'post';
    div.innerHTML = `
      <h3>${escapeHtml(p.title)}</h3>
      <div class="meta">${new Date(p.created).toLocaleString()}</div>
      <p>${escapeHtml(p.body)}</p>
      <button class="delete" data-id="${p.id}">Delete</button>
    `;
    postsContainer.appendChild(div);
  });
}

function escapeHtml(unsafe){
  return unsafe
       .replace(/&/g, '&amp;')
       .replace(/</g, '&lt;')
       .replace(/>/g, '&gt;')
       .replace(/"/g, '&quot;')
       .replace(/'/g, '&#039;');
}

if(blogForm){
  blogForm.addEventListener('submit', function(e){
    e.preventDefault();
    const title = document.getElementById('postTitle').value.trim();
    const body = document.getElementById('postBody').value.trim();
    if(!title || !body) return alert('Title and body are required');
    const posts = getPosts();
    const post = { id: Date.now().toString(), title, body, created: Date.now() };
    posts.push(post);
    savePosts(posts);
    blogForm.reset();
    renderPosts();
  });

  postsContainer.addEventListener('click', function(e){
    if(e.target.matches('.delete')){
      const id = e.target.dataset.id;
      let posts = getPosts();
      posts = posts.filter(p => p.id !== id);
      savePosts(posts);
      renderPosts();
    }
  });

  // initial render
  renderPosts();
}