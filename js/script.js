// O código está o mais comentado possível para ajudar na leitura

//selecionando os elementos requiridos
const selectBox = document.querySelector(".select-box"),
selectBtnX = selectBox.querySelector(".options .playerX"),
selectBtnO = selectBox.querySelector(".options .playerO"),
playBoard = document.querySelector(".play-board"),
players = document.querySelector(".players"),
allBox = document.querySelectorAll("section span"),
resultBox = document.querySelector(".result-box"),
wonText = resultBox.querySelector(".won-text"),
replayBtn = resultBox.querySelector("button");

window.onload = ()=>{ // uma vez que a janela carregada,
    for (let i = 0; i < allBox.length; i++) { //adicionar o atributo onclick em todo o intervalo disponível
       allBox[i].setAttribute("onclick", "clickedBox(this)");
    }
}

selectBtnX.onclick = ()=>{
    selectBox.classList.add("hide"); //ocultar caixa de seleção
    playBoard.classList.add("show"); //mostrar tabuleiro
}

selectBtnO.onclick = ()=>{ 
    selectBox.classList.add("hide"); //ocultar caixa de seleção
    playBoard.classList.add("show"); //mostrar tabuleiro
    players.setAttribute("class", "players active player"); //definir atributo de classe em "player" com valores de players active player
}

let playerXIcon = "fas fa-times"; //nome da classe da cruz em fontawesome
let playerOIcon = "far fa-circle"; //nome da classe do círculo em fontawesome
let playerSign = "X"; //esta é uma variável global porque usamos ela dentro de várias funções
let runBot = true; //usamos esta variável para parar o bot uma vez que a partida foi vencida por alguém ou empatada
// função de clique do usuário
function clickedBox(element){
    if(players.classList.contains("player")){
        playerSign = "O"; //se o jogador escolheu (O) então mude playerSign para O
        element.innerHTML = `<i class="${playerOIcon}"></i>`; //adicionando o ícone de círculo dentro do elemento/box clicada pelo usuário
        players.classList.add("active"); //adiciona active classe em players
        element.setAttribute("id", playerSign); //definir o atributo de id no span/box com o sinal escolhido pelo jogador
    }else{
        element.innerHTML = `<i class="${playerXIcon}"></i>`; //adicionando um ícone de cruz dentro do elemento/box clicada pelo usuário
        players.classList.add("active"); //adiciona active classe em players
        element.setAttribute("id", playerSign); //definir o atributo de id no span/box com o sinal escolhido pelo jogador
    }
    selectWinner(); //caliing selectWinner function
    element.style.pointerEvents = "none"; //once user select any box then that box can'be clicked again
    playBoard.style.pointerEvents = "none"; //add pointerEvents none to playboard so user can't immediately click on any other box until bot select
    let randomTimeDelay = ((Math.random() * 1000) + 200).toFixed(); //generating random number so bot will randomly delay to select unselected box
    setTimeout(()=>{
        bot(); //calling bot function
    }, randomTimeDelay); //passing random delay value
}

// bot auto select function
function bot(){
    let array = []; //creating empty array...we'll store unclicked boxes index
    if(runBot){ //if runBot is true
        playerSign = "O"; //change the playerSign to O so if player has chosen X then bot will O
        for (let i = 0; i < allBox.length; i++) {
            if(allBox[i].childElementCount == 0){ //if the box/span has no children means <i> tag
                array.push(i); //inserting unclicked boxes number/index inside array
            }
        }
        let randomBox = array[Math.floor(Math.random() * array.length)]; //getting random index from array so bot will select random unselected box
        if(array.length > 0){ //if array length is greater than 0
            if(players.classList.contains("player")){ 
                playerSign = "X"; //if player has chosen O then bot will X
                allBox[randomBox].innerHTML = `<i class="${playerXIcon}"></i>`; //adding cross icon tag inside bot selected element
                players.classList.remove("active"); //remove active class in players
                allBox[randomBox].setAttribute("id", playerSign); //set id attribute in span/box with player choosen sign
            }else{
                allBox[randomBox].innerHTML = `<i class="${playerOIcon}"></i>`; //adding circle icon tag inside bot selected element
                players.classList.remove("active"); //remove active class in players
                allBox[randomBox].setAttribute("id", playerSign); //set id attribute in span/box with player choosen sign
            }
            selectWinner(); //chamando a função selectWinner 
        }
        allBox[randomBox].style.pointerEvents = "none"; //quando o bot selecionar uma caixa, o usuário não poderá clicar nessa caixa
        playBoard.style.pointerEvents = "auto"; //adicionar pointerEvents auto no tabuleiro para que o usuário possa clicar novamente na caixa
        playerSign = "X"; //se o jogador escolheu X então o bot será O, então mudamos o playerSign novamente para X, então o usuário será X porque acima nós mudamos o playerSign do bot para O
    }
}

function getIdVal(classname){
    return document.querySelector(".box" + classname).id; //retorna valor de id
}
function checkIdSign(val1, val2, val3, sign){ //verificar se todos os valores de id são iguais ao sinal (X ou O) ou não se sim, retorne verdadeiro
    if(getIdVal(val1) == sign && getIdVal(val2) == sign && getIdVal(val3) == sign){
        return true;
    }
}
function selectWinner(){ //se a seguinte combinação corresponder, selecione o vencedor
    if(checkIdSign(1,2,3,playerSign) || checkIdSign(4,5,6, playerSign) || checkIdSign(7,8,9, playerSign) || checkIdSign(1,4,7, playerSign) || checkIdSign(2,5,8, playerSign) || checkIdSign(3,6,9, playerSign) || checkIdSign(1,5,9, playerSign) || checkIdSign(3,5,7, playerSign)){
        runBot = false; //passando o valor booleano falso para runBot para que o bot não execute novamente
        bot(); //chamando a função bot
        setTimeout(()=>{ //após a partida ser vencida por alguém, esconda o tabuleiro e mostre a caixa de resultado após 700ms
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
        }, 700); //1s = 1000ms
        wonText.innerHTML = `<p>${playerSign}</p> ganhou o jogo!`; //exibindo o texto vencedor com a passagem de playerSign (X ou O)
    }else{ // se todas as caixas/elemento tiverem sido preenchidas e ainda assim ninguém vencer, empate a partida
        if(getIdVal(1) != "" && getIdVal(2) != "" && getIdVal(3) != "" && getIdVal(4) != "" && getIdVal(5) != "" && getIdVal(6) != "" && getIdVal(7) != "" && getIdVal(8) != "" && getIdVal(9) != ""){
            runBot = false; //passando o valor booleano falso para runBot para que o bot não execute novamente
            bot(); //chamando a função bot
            setTimeout(()=>{ //após a partida ser empatada, esconda o tabuleiro e mostre a caixa de resultado após 700ms
                resultBox.classList.add("show");
                playBoard.classList.remove("show");
            }, 700); //1s = 1000ms
            wonText.textContent = "A partida deu empate!"; //mostrando o resultado empate
        }
    }
}

replayBtn.onclick = ()=>{
    window.location.reload(); //recarregar a página atual ao clicar no botão de jogar novamente 
}