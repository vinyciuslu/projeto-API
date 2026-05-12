// Declarações dos elementos usando Dom 

const videoElemento = document.getElementById("video")
const botaoScanner = document.getElementById("btn-texto")
const resultado = document.getElementById("resultado")
const canvas = document.getElementById("canvas")

// Função que habilita a camera 

async function configurarCamera() {
    try{
        const midia =await navigator.mediaDevices.getUserMedia({
            video: {facingMode: "environment"}, // camera traseira
            audio:false
        });
        // recebe a função midia para habilitar a camera 
        videoElemento.srcObject = midia;
        // garante que o video comece
        videoElemento.play();

    }catch(erro){
        resultado.innerText="Erro ao acessar a camera", erro
    }
}
// executa a função da camera
configurarCamera();

// função para ler o texto q a camera pegar  

botaoScanner.onclick = async ()=>{
    botaoScanner.disable=true; 
    resultado.innerText="Fazendo a leitura...aguarde";

    // preparando o canvas para cria a estrutura da camera 
    const contexto = canvas.getContext("2d");

    // ajusta o tamanho do canvas 
    canvas.width = videoElemento.videoWidth; // largura
    canvas.height = videoElemento.videoHeighy; // altura

    //reset para garantir que a foto nao saia invertida 
    contexto.setTransform(1, 0, 0, 1, 0, 0)

    // filtro de contraste e escala de cinza antes de tirar a foto

    contexto.filter = 'contraste(1.2) grayscale(1)';
    try{
        // cosumindo api
        const {data: {text }} = await Tesseract.recognize(
            canvas, // aonde o texto vai aparecer 
            'por' // idioma do texto
        );
        // remove espaços excessivos e caracteres especiais
        const textoFinal = text.trim();
        resultado.innerText = textoFinal.length > 0 ? textoFinal : "Não foi possivel identificar o texto"

    }catch(erro){
        console.error(erro);
        resultado.innerText="Erro ao processar", erro
    }
    finally{
        botaoScanner.disable=false; // desabilita a camera para fazer uma noca captura 
    }
}