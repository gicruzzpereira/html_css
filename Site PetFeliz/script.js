const serviceData = [
	['SPA Completo', 'Banho, hidratação, secagem e massagem relaxante.', 'R$ 89', 'R$ 109', '🫧'],
	['Higiene Bucal', 'Cuidado delicado para um sorriso mais saudável.', 'R$ 39', 'R$ 49', '🦷'],
	['Hidratação', 'Pelagem macia, nutrida e cheia de brilho.', 'R$ 45', 'R$ 55', '✨'],
	['Massoterapia', 'Relaxamento para aliviar tensões e melhorar o bem-estar.', 'R$ 59', 'R$ 69', '💆'],
	['Banho & Tosa', 'A combinação essencial para sair renovado.', 'R$ 69', 'R$ 89', '🛁'],
	['Corte de Unhas', 'Segurança e conforto para as patinhas.', 'R$ 25', 'R$ 30', '🐾'],
	['Tosa Higiênica', 'Higiene reforçada sem perder o estilo.', 'R$ 49', 'R$ 59', '✂️'],
	['Desembolo', 'Cuidado especial para pelagens que precisam de atenção.', 'R$ 55', 'R$ 65', '🪮'],
	['Day Care', 'Diversão, socialização e supervisão durante o dia.', 'R$ 79', 'R$ 89', '🎾']
];

const serviceList = document.querySelector('#service-list');
serviceList.innerHTML = serviceData.map(([name, description, dog, cat, icon]) => `
	<article class="service-card"><span class="service-icon">${icon}</span><h3>${name}</h3><p>${description}</p><div class="prices"><button type="button" data-service="${name} · Cães">Cães <strong>${dog}</strong></button><button type="button" data-service="${name} · Gatos">Gatos <strong>${cat}</strong></button></div></article>`).join('');

const sections = [...document.querySelectorAll('.page-section')];
const navLinks = [...document.querySelectorAll('[data-route]')];
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const toast = document.querySelector('.toast');

function showSection(route, updateHistory = true) {
	const target = document.getElementById(route) || document.getElementById('inicio');
	sections.forEach(section => section.classList.toggle('active-section', section === target));
	document.querySelectorAll('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.route === target.id));
	mainNav.classList.remove('open');
	menuToggle.setAttribute('aria-expanded', 'false');
	if (updateHistory) history.pushState({ route: target.id }, '', `#${target.id}`);
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

navLinks.forEach(link => link.addEventListener('click', event => {
	const route = link.dataset.route;
	if (!route) return;
	event.preventDefault();
	showSection(route);
}));
window.addEventListener('popstate', () => showSection(location.hash.slice(1) || 'inicio', false));
showSection(location.hash.slice(1) || 'inicio', false);

menuToggle.addEventListener('click', () => {
	const open = mainNav.classList.toggle('open');
	menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelector('.search-form').addEventListener('submit', event => {
	event.preventDefault();
	const query = event.currentTarget.querySelector('input').value.trim().toLowerCase();
	const match = serviceData.find(service => service[0].toLowerCase().includes(query));
	if (!query) return showToast('Digite algo para buscar.');
	showSection(match ? 'servicos' : 'servicos');
	showToast(match ? `Encontramos: ${match[0]}.` : 'Veja todos os nossos serviços.');
});

document.addEventListener('click', event => {
	const serviceButton = event.target.closest('[data-service]');
	const timeSlot = event.target.closest('.time-slot');
	if (serviceButton) {
		document.querySelector('#booking-form select').value = serviceButton.dataset.service.split(' · ')[0];
		showSection('agendamento');
		showToast(`${serviceButton.dataset.service} selecionado.`);
	}
	if (timeSlot) {
		document.querySelectorAll('.time-slot').forEach(button => button.classList.remove('selected'));
		timeSlot.classList.add('selected');
		showToast(`Horário ${timeSlot.textContent} selecionado.`);
	}
});

function handleForm(form, message) {
	form.addEventListener('submit', event => {
		event.preventDefault();
		if (!form.checkValidity()) { form.reportValidity(); return; }
		form.querySelector('.form-message').textContent = message;
		form.reset();
	});
}
handleForm(document.querySelector('#booking-form'), 'Agendamento confirmado! Enviamos os detalhes para você.');
handleForm(document.querySelector('#pet-form'), 'Pet cadastrado com sucesso!');
handleForm(document.querySelector('#payment-form'), 'Pagamento processado com segurança!');

const petSearch = document.querySelector('#pet-search');
petSearch.addEventListener('input', () => document.querySelectorAll('.pet-row').forEach(row => row.hidden = !row.textContent.toLowerCase().includes(petSearch.value.toLowerCase())));

const preview = { number: document.querySelector('#card-preview-number'), name: document.querySelector('#card-preview-name'), expiry: document.querySelector('#card-preview-expiry') };
document.querySelector('#card-number').addEventListener('input', event => { event.target.value = event.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim(); preview.number.textContent = event.target.value || '0000 0000 0000 0000'; });
document.querySelector('#card-name').addEventListener('input', event => preview.name.textContent = event.target.value.toUpperCase() || 'NOME COMPLETO');
document.querySelector('#card-expiry').addEventListener('input', event => { event.target.value = event.target.value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2'); preview.expiry.textContent = event.target.value || 'MM/AA'; });
document.querySelectorAll('.payment-tab').forEach(tab => tab.addEventListener('click', () => { document.querySelectorAll('.payment-tab').forEach(item => item.classList.remove('active')); tab.classList.add('active'); document.querySelector('#card-fields').classList.toggle('hidden', tab.dataset.payment !== 'card'); document.querySelector('#alternative-payment').classList.toggle('hidden', tab.dataset.payment === 'card'); }));

function showToast(message) { toast.textContent = message; toast.classList.add('visible'); setTimeout(() => toast.classList.remove('visible'), 2600); }