// --- main.js ---

// TU NÚMERO DE WHATSAPP (Cámbialo al de la Florería)
const TELEFONO_FLORERIA = "5493814644817"; 

const form = document.getElementById('contactForm');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const contacto = document.getElementById('contacto').value;
        const mensaje = document.getElementById('mensaje').value;
        
        const btn = form.querySelector('button');
        const originalText = btn.innerText;

        btn.innerText = "Abriendo WhatsApp...";
        btn.style.opacity = "0.7";

        // Mensaje formateado para Venta de Flores
        const texto = `🌸 *Hola Alstroemeria*, quiero hacer un pedido:%0A%0A` +
                      `👤 *Nombre:* ${nombre}%0A` +
                      `📱 *Teléfono:* ${contacto}%0A` +
                      `💐 *Pedido/Consulta:* ${mensaje}`;

        const url = `https://wa.me/+5493814744343?text=${texto}`;
        
        setTimeout(() => {
            window.open(url, '_blank');
            btn.innerText = "¡Enviado!";
            btn.style.background = "#10b981"; // Verde éxito
            form.reset();
            
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = "";
                btn.style.opacity = "1";
            }, 3000);
        }, 1000);
    });
}