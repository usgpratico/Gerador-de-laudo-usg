import { useState } from 'react';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';
import { Document, Packer, Paragraph } from 'docx';

export default function GeradorLaudoUSG() {
  const [tipoExame, setTipoExame] = useState("Abdome Total");
  const [nomePaciente, setNomePaciente] = useState("");
  const [idadePaciente, setIdadePaciente] = useState("");
  const [laudo, setLaudo] = useState("");
  const [imagens, setImagens] = useState([]);

  const estruturas = {
    "Abdome Total": ["Fígado", "Vesícula Biliar", "Pâncreas", "Baço", "Rins", "Bexiga"],
    "Rins e Vias Urinárias": ["Rins", "Bexiga"],
    "Próstata": ["Próstata", "Vesículas Seminais"],
    "Tireoide": ["Lobo Direito", "Lobo Esquerdo", "Istmo"]
  };

  const gerarLaudo = () => {
    let texto = `\nLAUDO DE ULTRASSONOGRAFIA - ${tipoExame.toUpperCase()}\n\n`;
    texto += `Paciente: ${nomePaciente}\nIdade: ${idadePaciente}\n\n`;
    estruturas[tipoExame].forEach(orgao => {
      texto += `**${orgao}**: descrição normal.\n`;
    });
    texto += `\n\nDr. William Castro\nCRM-BA 42019\n`;
    setLaudo(texto);
  };

  const imprimir = () => window.print();

  const salvarPDF = () => {
    html2pdf().from(document.getElementById("laudoArea")).save("laudo.pdf");
  };

  const salvarDOCX = () => {
    const doc = new Document({
      sections: [{
        children: laudo.split('\n').map(line => new Paragraph(line))
      }]
    });
    Packer.toBlob(doc).then(blob => saveAs(blob, "laudo.docx"));
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const imgs = files.map(file => URL.createObjectURL(file));
    setImagens(imgs);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Gerador de Laudo de Ultrassonografia</h1>

      <div className="mb-4">
        <label className="block font-medium">Nome do paciente:</label>
        <input className="border p-2 w-full" value={nomePaciente} onChange={e => setNomePaciente(e.target.value)} />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Idade:</label>
        <input className="border p-2 w-full" value={idadePaciente} onChange={e => setIdadePaciente(e.target.value)} />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Tipo de exame:</label>
        <select className="border p-2 w-full" value={tipoExame} onChange={e => setTipoExame(e.target.value)}>
          {Object.keys(estruturas).map(tipo => (
            <option key={tipo}>{tipo}</option>
          ))}
        </select>
      </div>

      <button onClick={gerarLaudo} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">Gerar Laudo</button>

      <div id="laudoArea" className="whitespace-pre-wrap border p-4 bg-white">
        {laudo}
      </div>

      <div className="flex gap-2 my-4">
        <button onClick={imprimir} className="bg-gray-700 text-white px-4 py-2 rounded">Imprimir</button>
        <button onClick={salvarPDF} className="bg-green-700 text-white px-4 py-2 rounded">Salvar como PDF</button>
        <button onClick={salvarDOCX} className="bg-purple-700 text-white px-4 py-2 rounded">Salvar como DOCX</button>
      </div>

      <div className="mb-4">
        <label className="block font-medium">Upload de imagens do exame:</label>
        <input type="file" accept="image/*" multiple onChange={handleUpload} />
      </div>

      {imagens.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {imagens.map((src, i) => (
            <img key={i} src={src} alt={`Imagem ${i + 1}`} className="border" />
          ))}
        </div>
      )}
    </div>
  );
}