// Configuração do Canvas Interativo
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');

let stars = [];
const numStars = 220; // Quantidade de estrelas

// Posição do mouse
const mouse = {
    x: null,
    y: null,
    radius: 120 // Raio de alcance da "onda do barco"
};

// Ajusta o tamanho da tela dinamicamente
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Captura a movimentação do mouse
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

// Reseta quando o mouse sai da tela
window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Classe que cria cada Estrela
class Star {
    constructor() {
        // Posição original (onde ela deve morar)
        this.originX = Math.random() * canvas.width;
        this.originY = Math.random() * canvas.height;
        // Posição atual (que se move com a onda)
        this.x = this.originX;
        this.y = this.originY;
        this.size = Math.random() * 2 + 0.8;
        this.baseAlpha = Math.random() * 0.7 + 0.3;
        this.density = (Math.random() * 20) + 10; // "Peso" da estrela na água
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.baseAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#38bdf8';
        ctx.fill();
    }

    update() {
        // Distância entre o mouse e a estrela
        if (mouse.x != null && mouse.y != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // Se o mouse estiver perto, cria o efeito de onda/empurrão de barco
            if (distance < mouse.radius) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (mouse.radius - distance) / mouse.radius;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;

                // Empurra a estrela para longe do cursor
                this.x -= directionX;
                this.y -= directionY;
            } else {
                // Se o mouse passou, ela volta suavemente para o lugar original (como a água acalmando)
                if (this.x !== this.originX) {
                    let dxOrig = this.x - this.originX;
                    this.x -= dxOrig * 0.05;
                }
                if (this.y !== this.originY) {
                    let dyOrig = this.y - this.originY;
                    this.y -= dyOrig * 0.05;
                }
            }
        } else {
            // Volta pro lugar se o mouse não estiver na tela
            if (this.x !== this.originX) this.x -= (this.x - this.originX) * 0.05;
            if (this.y !== this.originY) this.y -= (this.y - this.originY) * 0.05;
        }

        this.draw();
    }
}

// Inicializa todas as estrelas
function init() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }
}
init();

// Loop de animação contínua (60 frames por segundo)
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < stars.length; i++) {
        stars[i].update();
    }
    requestAnimationFrame(animate);
}
animate();
