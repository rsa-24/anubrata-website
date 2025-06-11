// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.style.display = 'none';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking
            navLinks.style.display = 'none';
        }
    });
});

// Enhanced loadProjects with status, duration, and publication tracker
async function loadProjects() {
    try {
        const response = await fetch('data/projects.json');
        const projects = await response.json();
        const projectsGrid = document.getElementById('projects-grid');
        projectsGrid.innerHTML = '';
        let publicationTracker = null;
        projects.forEach((project, idx) => {
            if (project.type === 'publication-tracker') {
                publicationTracker = project;
                return;
            }
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            // Use a placeholder image for now
            const imgSrc = project.image || `https://source.unsplash.com/400x220/?technology,abstract,${idx}`;
            projectCard.innerHTML = `
                <div class="project-img-mockup"><img src="${imgSrc}" alt="Project Screenshot"></div>
                <h3>${project.title}</h3>
                ${project.status ? `<div class=\"project-status-below\"><span class=\"project-status ${project.status}\" status=\"${project.status}\">${project.status}</span></div>` : ''}
                <div class=\"project-duration\">${project.duration || ''}</div>
                <p>${project.description}</p>
                <div class=\"project-tags\">${project.tags.map(tag => `<span class=\"tag\">${tag}</span>`).join('')}</div>
                ${project.link ? `<a href=\"${project.link}\" target=\"_blank\" class=\"btn\">View Project</a>` : ''}
            `;
            projectsGrid.appendChild(projectCard);
        });
        // Publication Tracker
        if (publicationTracker) {
            const pubDiv = document.createElement('div');
            pubDiv.className = 'publication-tracker';
            pubDiv.innerHTML = `<h3>Publication Tracker</h3><ul class="publication-list">${publicationTracker.publications.map(pub => `
                <li><strong>${pub.title}</strong> <span class="publication-status">[${pub.status}]</span><br><span>${pub.date}</span> <span style="color:#888;">${pub.note || ''}</span></li>
            `).join('')}</ul>`;
            projectsGrid.appendChild(pubDiv);
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Blog search, filter, and rendering
let allPosts = [];
let filteredPosts = [];
let selectedCategory = '';
let selectedTag = '';

function renderBlog(posts) {
    const blogPosts = document.getElementById('blog-posts');
    blogPosts.innerHTML = '';
    // Categories
    const categories = Array.from(new Set(allPosts.map(p => p.category)));
    const tags = Array.from(new Set(allPosts.flatMap(p => p.tags)));
    // Search bar
    const searchBar = document.createElement('div');
    searchBar.className = 'blog-search-bar';
    searchBar.innerHTML = `
        <input type="text" id="blog-search-input" placeholder="Search blog posts...">
    `;
    blogPosts.appendChild(searchBar);
    // Category filter
    const catDiv = document.createElement('div');
    categories.forEach(cat => {
        const catBtn = document.createElement('span');
        catBtn.className = 'blog-category' + (cat === selectedCategory ? ' selected' : '');
        catBtn.textContent = cat;
        catBtn.tabIndex = 0;
        catBtn.onclick = () => { selectedCategory = (selectedCategory === cat ? '' : cat); filterAndRenderBlog(); };
        catBtn.onkeypress = e => { if (e.key === 'Enter') catBtn.onclick(); };
        catDiv.appendChild(catBtn);
    });
    blogPosts.appendChild(catDiv);
    // Tag filter
    const tagDiv = document.createElement('div');
    tags.forEach(tag => {
        const tagBtn = document.createElement('span');
        tagBtn.className = 'blog-tag' + (tag === selectedTag ? ' selected' : '');
        tagBtn.textContent = tag;
        tagBtn.tabIndex = 0;
        tagBtn.onclick = () => { selectedTag = (selectedTag === tag ? '' : tag); filterAndRenderBlog(); };
        tagBtn.onkeypress = e => { if (e.key === 'Enter') tagBtn.onclick(); };
        tagDiv.appendChild(tagBtn);
    });
    blogPosts.appendChild(tagDiv);
    // Posts
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'blog-post';
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <div class="post-meta">
                <span class="date">${new Date(post.date).toLocaleDateString()}</span>
                <span class="blog-category">${post.category}</span>
                ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
            </div>
            <p>${post.content}</p>
            ${post.link ? `<a href="${post.link}" target="_blank" class="btn">Read More</a>` : ''}
        `;
        blogPosts.appendChild(postElement);
    });
    // Search functionality
    document.getElementById('blog-search-input').oninput = e => {
        filterAndRenderBlog(e.target.value);
    };
}

async function loadBlogPosts() {
    try {
        const response = await fetch('data/blog.json');
        allPosts = await response.json();
        filterAndRenderBlog();
    } catch (error) {
        console.error('Error loading blog posts:', error);
    }
}

function filterAndRenderBlog(search = '') {
    filteredPosts = allPosts.filter(post => {
        const matchesCategory = !selectedCategory || post.category === selectedCategory;
        const matchesTag = !selectedTag || post.tags.includes(selectedTag);
        const matchesSearch = !search || post.title.toLowerCase().includes(search.toLowerCase()) || post.content.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesTag && matchesSearch;
    });
    renderBlog(filteredPosts);
}

// Academic Timeline Data
const timelineData = [
  {
    title: 'Indian Institute of Technology Palakkad',
    degree: 'M.Tech in Data Science',
    date: '2023–2025',
    details: 'CGPA: 8.14/10.0',
    icon: 'fa-graduation-cap',
  },
  {
    title: 'Ramakrishna Mission Vivekananda Educational & Research Institute',
    degree: 'M.Sc in Mathematics',
    date: '2019–2021',
    details: 'CGPA: 9.71/10.0 (First Class First)',
    icon: 'fa-university',
  },
  {
    title: 'The University of Burdwan',
    degree: 'B.Sc in Mathematics (Honours)',
    date: '2015–2018',
    details: 'Overall Percentage: 67.75%',
    icon: 'fa-book',
  },
];

function renderTimeline() {
  const timeline = document.createElement('div');
  timeline.className = 'timeline';
  timelineData.forEach(item => {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    timelineItem.innerHTML = `
      <div class="timeline-dot"><i class="fas ${item.icon}"></i></div>
      <div class="timeline-content">
        <h4>${item.title}</h4>
        <span class="timeline-date">${item.date}</span>
        <div>${item.degree}</div>
        <div>${item.details}</div>
      </div>
    `;
    timeline.appendChild(timelineItem);
  });
  document.getElementById('timeline').appendChild(timeline);
}

function renderSkills() {
  const aboutContent = document.querySelector('.about-content');
  const skillsSection = document.createElement('div');
  skillsSection.className = 'skills-section';
  skillsSection.innerHTML = `
    <h3>Technical Skills</h3>
    <div class="skills-list-visual">
      <div class="skill-item"><i class="fab fa-python"></i> Python <div class="skill-bar"><div class="skill-bar-fill" style="width: 95%"></div></div></div>
      <div class="skill-item"><i class="fas fa-database"></i> SQL <div class="skill-bar"><div class="skill-bar-fill" style="width: 85%"></div></div></div>
      <div class="skill-item"><i class="fas fa-chart-line"></i> Data Visualization <div class="skill-bar"><div class="skill-bar-fill" style="width: 90%"></div></div></div>
      <div class="skill-item"><i class="fas fa-brain"></i> Machine Learning <div class="skill-bar"><div class="skill-bar-fill" style="width: 88%"></div></div></div>
      <div class="skill-item"><i class="fas fa-calculator"></i> MATLAB <div class="skill-bar"><div class="skill-bar-fill" style="width: 80%"></div></div></div>
      <div class="skill-item"><i class="fas fa-code"></i> LaTeX <div class="skill-bar"><div class="skill-bar-fill" style="width: 90%"></div></div></div>
    </div>
  `;
  aboutContent.appendChild(skillsSection);
}

function renderBatchPhoto() {
  const aboutContent = document.querySelector('.about-content');
  const batchSection = document.createElement('div');
  batchSection.className = 'batch-photo-section';
  batchSection.innerHTML = `
    <img src="assets/batch.jpg" alt="M.Tech Data Science Batch 2023-2025, IIT Palakkad" class="batch-photo-img">
    <div class="batch-photo-caption">M.Tech Data Science Batch 2023-2025, IIT Palakkad</div>
    <div class="batch-photo-context">During my M.Tech journey at IIT Palakkad (2023-2025)</div>
  `;
  aboutContent.appendChild(batchSection);
}

// Smooth scroll for navigation links
function enableSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

enableSmoothScroll();

// Section reveal animation on scroll
function revealSectionsOnScroll() {
  const sections = document.querySelectorAll('section, .section-reveal');
  const reveal = () => {
    const trigger = window.innerHeight * 0.92;
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top < trigger) {
        sec.classList.add('visible');
      }
    });
  };
  window.addEventListener('scroll', reveal);
  reveal();
}

document.querySelectorAll('section').forEach(sec => sec.classList.add('section-reveal'));
revealSectionsOnScroll();

// Progress bar
function updateProgressBar() {
  let bar = document.getElementById('progress-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'progress-bar';
    document.body.appendChild(bar);
  }
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = percent + '%';
  });
}
updateProgressBar();

// Loading animation
function showLoading() {
  let overlay = document.getElementById('loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(overlay);
  }
  overlay.style.opacity = '1';
  overlay.style.display = 'flex';
}
function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => { overlay.style.display = 'none'; }, 400);
  }
}
showLoading();
window.addEventListener('load', hideLoading);

// Dark/Light Mode Toggle
function setupDarkModeToggle() {
  const btn = document.getElementById('dark-mode-toggle');
  const icon = btn.querySelector('i');
  function setMode(dark) {
    document.body.classList.toggle('dark-mode', dark);
    icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('darkMode', dark ? '1' : '0');
  }
  btn.onclick = () => setMode(!document.body.classList.contains('dark-mode'));
  // Load preference
  const darkPref = localStorage.getItem('darkMode') === '1';
  setMode(darkPref);
}
setupDarkModeToggle();

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    loadBlogPosts();
    renderTimeline();
    renderBatchPhoto();
    renderSkills();

    // Password-protected resume download
    const resumeBtn = document.getElementById('view-resume-btn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            const password = prompt('Enter the password to access the resume:');
            if (password === 'ResearchFirst') {
                window.open('assets/resume.pdf', '_blank');
            } else if (password !== null) {
                alert('Incorrect password. Access denied.');
            }
        });
    }
}); 