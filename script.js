// Script para animação de surgimento dos elementos
const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold: 0.2 };
const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
    });
}, appearOptions);
faders.forEach(fader => appearOnScroll.observe(fader));

// --- Script para o botão de copiar PIX ---
const copyBtn = document.getElementById('copy-btn');
if (copyBtn) {
    const pixKey = document.getElementById('pix-key').innerText;
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(pixKey).then(() => {
            copyBtn.innerText = 'Copiado!';
            setTimeout(() => { copyBtn.innerText = 'Copiar Chave PIX'; }, 2000);
        }).catch(err => { 
            console.error('Erro ao copiar a chave PIX: ', err);
            alert('Erro ao copiar a chave.'); 
        });
    });
}

// --- Script para o contador regressivo ---
const countdown = () => {
    const weddingDate = new Date('November 15, 2025 12:00:00').getTime();
    const now = new Date().getTime();
    const gap = weddingDate - now;

    if (gap < 0) {
        document.getElementById('countdown').innerHTML = "<h3 style='color:white; font-family: \"Cormorant Garamond\", serif;'>É hoje o grande dia!</h3>";
        clearInterval(countdownInterval); // Para o contador
        return;
    }

    const second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24;
    const textDay = String(Math.floor(gap / day)).padStart(2, '0');
    const textHour = String(Math.floor((gap % day) / hour)).padStart(2, '0');
    const textMinute = String(Math.floor((gap % hour) / minute)).padStart(2, '0');
    const textSecond = String(Math.floor((gap % minute) / second)).padStart(2, '0');

    document.getElementById('days').innerText = textDay;
    document.getElementById('hours').innerText = textHour;
    document.getElementById('minutes').innerText = textMinute;
    document.getElementById('seconds').innerText = textSecond;
};
// Inicia o contador e atualiza a cada segundo
const countdownInterval = setInterval(countdown, 1000);


// --- Scripts do Formulário de Presença (RSVP) ---
const rsvpForm = document.getElementById('rsvp-form');
if (rsvpForm) {
    const successMessage = document.getElementById('success-message');
    const conditionalFields = document.getElementById('conditional-fields');
    // ATENÇÃO: Coloque aqui o 'name' da sua pergunta de presença do Google Forms
    const presenceRadios = document.querySelectorAll('input[name="entry.1209342466"]');

    // 1. Lógica para mostrar/esconder campos
    presenceRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'Sim, estarei presente') {
                conditionalFields.style.maxHeight = '300px';
                conditionalFields.style.opacity = '1';
                conditionalFields.style.marginTop = '1.5rem';
                conditionalFields.style.paddingTop = '1.5rem'; // Adiciona espaço interno
            } else {
                conditionalFields.style.maxHeight = '0';
                conditionalFields.style.opacity = '0';
                conditionalFields.style.marginTop = '0';
                conditionalFields.style.paddingTop = '0';
            }
        });
    });

    // 2. Lógica de envio do formulário
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitButton = rsvpForm.querySelector('button');
        submitButton.innerText = 'Enviando...';
        submitButton.disabled = true;
        
        const formData = new FormData(rsvpForm);
        // ATENÇÃO: Troque pela URL 'formResponse' do seu formulário
        const url = 'https://docs.google.com/forms/d/e/1FAIpQLSflHvy5-y-iuIWIl0JdOQPKo0KhgtGuA54Q_nPGTJsaMO6MXA/formResponse';

        fetch(url, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        })
        .then(() => {
            rsvpForm.style.display = 'none';
            successMessage.style.display = 'block';
        })
        .catch(error => {
            console.error('Erro ao enviar:', error.message);
            alert('Ocorreu um erro ao confirmar. Tente novamente, por favor.');
            submitButton.innerText = 'Confirmar Presença';
            submitButton.disabled = false;
        });
    });
}

// === SCRIPT DA LISTA DE PRESENTES ===
const giftModal = document.getElementById('gift-modal');
if (giftModal) {
    const presentearBtns = document.querySelectorAll('.btn-presentear');
    const closeModalBtn = document.getElementById('close-modal');
    
    // Elementos do Modal
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const giftNameInput = document.getElementById('gift-name-input');
    const giftConfirmationForm = document.getElementById('gift-confirmation-form');
    const giftSuccessMsg = document.getElementById('gift-success-msg');

    // Função para abrir o modal
    const openModal = (card) => {
        const title = card.dataset.title;
        const price = card.dataset.price;
        const img = card.dataset.img;

        modalImg.src = img;
        modalTitle.innerText = title;
        modalPrice.innerText = price;
        giftNameInput.value = `${title} (${price})`; // Preenche o nome do presente no formulário escondido

        giftModal.style.display = 'flex';
        setTimeout(() => giftModal.classList.add('visible'), 10);
    };

    // Função para fechar o modal
    const closeModal = () => {
        giftModal.classList.remove('visible');
        setTimeout(() => {
            giftModal.style.display = 'none';
            // Reseta o formulário para uma próxima abertura
            giftConfirmationForm.style.display = 'block';
            giftSuccessMsg.style.display = 'none';
            giftConfirmationForm.reset();
        }, 300);
    };

    // Adiciona evento para cada botão "Presentear"
    presentearBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.gift-card');
            openModal(card);
        });
    });

    // Eventos para fechar o modal
    closeModalBtn.addEventListener('click', closeModal);
    giftModal.addEventListener('click', (e) => {
        if (e.target === giftModal) {
            closeModal();
        }
    });

    // Envio do formulário de confirmação do presente
    giftConfirmationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = giftConfirmationForm.querySelector('button');
        submitBtn.innerText = 'Enviando...';
        submitBtn.disabled = true;

        const formData = new FormData(giftConfirmationForm);
        // ATENÇÃO: Use a URL 'formResponse' do SEU NOVO formulário de presentes
        const url = 'https://docs.google.com/forms/d/e/1FAIpQLSdgpBI0o_cFvJB_maUCNRXNa0jYAD6VUr7H2nFTCkdEyZCx6Q/formResponse';

        fetch(url, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        })
        .then(() => {
            giftConfirmationForm.style.display = 'none';
            giftSuccessMsg.style.display = 'block';
        })
        .catch(error => {
            console.error('Erro ao confirmar presente:', error.message);
            alert('Ocorreu um erro ao notificar. Tente novamente.');
            submitBtn.innerText = 'Já fiz o PIX, confirmar presente!';
            submitBtn.disabled = false;
        });
    });

    // Botão de copiar PIX dentro do modal
    const modalCopyBtn = document.getElementById('modal-copy-btn');
    const modalPixKey = document.getElementById('modal-pix-key').innerText;
    modalCopyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(modalPixKey).then(() => {
            modalCopyBtn.innerText = 'Copiado!';
            setTimeout(() => { modalCopyBtn.innerText = 'Copiar Chave'; }, 2000);
        });
    });
}

// script.js

// --- LÓGICA PARA PAGINAÇÃO DE PRESENTES ---
document.addEventListener('DOMContentLoaded', () => {
    const pageButtons = document.querySelectorAll('.page-btn');
    const giftPages = document.querySelectorAll('.gift-page');

    pageButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe 'active' de todos os botões e páginas
            pageButtons.forEach(btn => btn.classList.remove('active'));
            giftPages.forEach(page => page.classList.remove('active'));

            // Adiciona a classe 'active' ao botão clicado
            button.classList.add('active');

            // Mostra a página correspondente
            const pageId = button.getAttribute('data-page');
            document.getElementById(pageId).classList.add('active');
        });
    });
});