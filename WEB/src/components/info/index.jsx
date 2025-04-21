import "./index.css"

export function Info(){
  return (
    <>
      <p className="text">
        <b><i>Observação de uso:</i></b><br/><br/>
        
        <b>1.</b> Arquivo .pdf somente 1 arquivo por vez.<br/>
        <b>2.</b> Arquivo .jpg, .jpeg e .png carrega 1 arquivo por vez e multiplos arquivo também.<br/>
        <b>3.</b> Outros tipo de arquivo não aceita alem imagem e pdf.<br/>
        <b>4.</b> Botão Close ficará desabilitado no carregamento e upload também.<br/>
        <b>5.</b> Botão Close so vai permitir carregamento novos arquivos e a lista será limpa.<br/>
        <b>6.</b> Clicando no botão upload será carregado os arquivos para API e salvos.<br/>
        <b>7.</b>Botão upload habilitado, posibilita carregamento de arquivos multiplos, e será possivel remoção de um arquivo não desejado antes do upload, após upload não será mais possível.<br/>
        <b>8.</b> Após carregamento, <b>nome do arquivo</b> ficara habilitado o link para download.
      </p>
    </>
  )
}