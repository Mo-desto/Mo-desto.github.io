 const body = document.body;
    const panelWrap = document.getElementById('panelWrap');
    const panel = document.getElementById('panel');
    const themeToggle = document.getElementById('themeToggle');
    const contactModal = document.getElementById('contactModal');
    

    let activeTab = null;
    let isAnimating = false;

    const sections = {
      perfil: `
        <div class="panel-title">
          Perfil profesional
        </div>
        <p class="panel-text">
          Desarrollador en formación, orientado al desarrollo de software, sitios web y Ecommerce funcionales para proyectos reales.
        </p>
        <div class="chips">
          <span class="chip">Ing</span>
          <span class="chip">Sistemas</span>
          <span class="chip">Marca personal</span>
        </div>
      `,
      trabajos: `
        <div class="panel-title">
          <i data-lucide="folder-kanban" size="18"></i>
          Trabajos destacados
        </div>
        <div class="project-list">
          <div class="project">
            <div><strong>Celina Tech</strong><span>HTML · CSS · JavaScript · SQL</span></div>
            <i data-lucide="arrow-up-right" size="18"></i>
          </div>
          <div class="project">
            <div><strong>Sistema Conable</strong><span>Node · JS · SQL</span></div>
            <i data-lucide="arrow-up-right" size="18"></i>
          </div>
          <div class="project">
            <div><strong>Porfolio</strong><span>Animación · UI moderna</span></div>
            <i data-lucide="arrow-up-right" size="18"></i>
          </div>
        </div>
      `,
      skills: `
        <div class="panel-title">
          <i data-lucide="terminal" size="18"></i>
          Skills y tecnologías
        </div>
        <p class="panel-text">
          Base frontend con foco en estructura, responsive design, microinteracciones y experiencia visual clara.
        </p>
        <div class="tech-grid">
          <div class="tech-icon" data-tech="HTML5">
            <i class="devicon-html5-plain colored"></i>
          </div>
          <div class="tech-icon" data-tech="CSS3">
            <i class="devicon-css3-plain colored"></i>
          </div>
          <div class="tech-icon" data-tech="JavaScript">
            <i class="devicon-javascript-plain colored"></i>
          </div>
          <div class="tech-icon" data-tech="GitHub">
            <i class="devicon-github-original"></i>
          </div>
          <div class="tech-icon" data-tech="Linux">
            <i class="devicon-linux-plain colored"></i>
          </div>

          <div class="tech-icon" data-tech="C#">
            <i class="devicon-csharp-plain colored"></i>
          </div>

          <div class="tech-icon" data-tech="Node.js">
            <i class="devicon-nodejs-plain colored"></i>
          </div>

          <div class="tech-icon" data-tech="SQL">
            <i class="devicon-azuresqldatabase-plain colored"></i>
          </div>

          

          <div class="tech-icon" data-tech="Hosting">
            <i data-lucide="server"></i>
          </div>
        </div>
      `
    };

    function setThemeUI() {
      const isDark = body.classList.contains('dark');
      const icon = isDark ? 'sun-medium' : 'moon-star';

      themeToggle.innerHTML = `<i data-lucide="${icon}" size="18"></i>`;
      lucide.createIcons();
    }

    function toggleTheme() {
      body.classList.toggle('dark');
      localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
      setThemeUI();
    }

    function openContactModal() {
      contactModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => document.getElementById('contactName').focus(), 120);
      lucide.createIcons();
    }

    function closeContactModal(event) {
      if (event && event.target !== contactModal) return;
      contactModal.classList.remove('open');
      document.body.style.overflow = '';
    }

    async function sendContactEmail(event) {
      event.preventDefault();

      const submitButton = document.querySelector('.btn-send');
      const originalHTML = submitButton.innerHTML;

      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      submitButton.disabled = true;
      submitButton.innerHTML = `<i data-lucide="loader-circle" class="spin" size="16"></i> Enviando`;
      lucide.createIcons();

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            message
          })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Error al enviar');
        }

        submitButton.innerHTML = `<i data-lucide="check" size="16"></i> Enviado`;
        lucide.createIcons();

        document.getElementById('contactName').value = '';
        document.getElementById('contactEmail').value = '';
        document.getElementById('contactMessage').value = '';

        setTimeout(() => {
          closeContactModal();
          submitButton.disabled = false;
          submitButton.innerHTML = originalHTML;
          lucide.createIcons();
        }, 1200);

      } catch (error) {
        submitButton.disabled = false;
        submitButton.innerHTML = `<i data-lucide="triangle-alert" size="16"></i> Error`;
        lucide.createIcons();

        setTimeout(() => {
          submitButton.innerHTML = originalHTML;
          lucide.createIcons();
        }, 1800);

        console.error(error);
      }
    }

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && contactModal.classList.contains('open')) {
        closeContactModal();
      }
    });

    function clearTabs() {
      document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
      document.getElementById('tabs').classList.remove('has-active');
    }

    function moveIndicator(button) {
      const tabs = document.getElementById('tabs');
      const tabsRect = tabs.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const x = buttonRect.left - tabsRect.left - 7;

      tabs.style.setProperty('--indicator-x', `${x}px`);
      tabs.classList.add('has-active');
    }

    function closePanel() {
      isAnimating = true;
      panel.classList.remove('swap-in');
      panel.classList.add('swap-out');

      setTimeout(() => {
        panelWrap.classList.remove('open');
        panel.innerHTML = '';
        panel.classList.remove('swap-out');
        activeTab = null;
        isAnimating = false;
        lucide.createIcons();
      }, 260);
    }

    function openPanel(type) {
      isAnimating = true;
      panelWrap.classList.add('open');
      panel.classList.remove('swap-in', 'swap-out');
      panel.classList.add('swap-out');

      setTimeout(() => {
        panel.innerHTML = sections[type];
        panel.classList.remove('swap-out');
        panel.classList.add('swap-in');
        activeTab = type;
        isAnimating = false;
        lucide.createIcons();
      }, 210);
    }

    function toggleTab(type, button) {
      if (isAnimating) return;

      if (activeTab === type) {
        clearTabs();
        closePanel();
        return;
      }

      clearTabs();
      button.classList.add('active');
      moveIndicator(button);
      openPanel(type);
    }

    if (localStorage.getItem('theme') === 'dark') {
      body.classList.add('dark');
    }

    setThemeUI();