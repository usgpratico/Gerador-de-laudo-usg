import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const exames = {
  "Abdome Total": {
    "Fígado": ["Normal", "Esteatose leve", "Esteatose moderada", "Lesão focal"],
    "Vesícula Biliar": ["Normal", "Colelitíase", "Lodo biliar", "Espessamento parietal"],
    "Pâncreas": ["Normal", "Ecotextura heterogênea", "Dilatação do ducto de Wirsung"],
    "Baço": ["Normal", "Esplenomegalia", "Lesão focal"],
    "Rins": ["Normal", "Cisto simples", "Litíase", "Hidronefrose leve"],
    "Bexiga": ["Normal", "Espessamento parietal", "Resíduo urinário elevado"]
  },
  "Rins e Vias Urinárias": {
    "Rins": ["Normal", "Cisto simples", "Litíase", "Hidronefrose leve"],
    "Bexiga": ["Normal", "Espessamento parietal", "Resíduo urinário elevado"]
  },
  "Próstata": {
    "Próstata": ["Normal", "Aumentada", "Calcificações", "Lesão hipoecogênica"],
    "Vesículas Seminais": ["Normais", "Assimétricas", "Dilatadas"]
  },
  "Tireóide": {
    "Lobo Direito": ["Normal", "Nódulo sólido", "Nódulo cístico", "Hipoecogenicidade difusa"],
    "Lobo Esquerdo": ["Normal", "Nódulo sólido", "Nódulo cístico", "Hipoecogenicidade difusa"],
    "Istmo": ["Normal", "Espessado"]
  }
};

export default function GeradorLaudoUSG() {
  const [tipoExame, setTipoExame] = useState("");
  const [selecoes, setSelecoes] = useState({});
  const [medidas, setMedidas] = useState({});
  const [laudo, setLaudo] = useState("");

  const gerarLaudo = () => {
    let texto = `LAUDO DE ULTRASSONOGRAFIA - ${tipoExame.toUpperCase()}\n\n`;
    Object.entries(selecoes).forEach(([estrutura, achado]) => {
      const medida = medidas[estrutura] ? ` (Medidas: ${medidas[estrutura]})` : "";
      texto += `**${estrutura}**: ${achado}${medida}.\n`;
    });
    texto += "\nConclusão: Exame realizado com técnica adequada. Veja descrição por estrutura.";
    setLaudo(texto);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gerador de Laudo de Ultrassonografia</h1>

      <div className="mb-4">
        <label className="font-medium">Tipo de exame:</label>
        <Tabs defaultValue="" className="mt-2">
          <TabsList>
            {Object.keys(exames).map((tipo) => (
              <TabsTrigger key={tipo} value={tipo} onClick={() => {
                setTipoExame(tipo);
                setSelecoes({});
                setMedidas({});
              }}>{tipo}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {tipoExame && (
        <Tabs defaultValue={Object.keys(exames[tipoExame])[0]} className="mb-4">
          <TabsList>
            {Object.keys(exames[tipoExame]).map((estrutura) => (
              <TabsTrigger key={estrutura} value={estrutura}>{estrutura}</TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(exames[tipoExame]).map(([estrutura, opcoes]) => (
            <TabsContent key={estrutura} value={estrutura} className="mt-4 space-y-2">
              <div className="font-semibold">{estrutura}</div>
              <div className="flex flex-wrap gap-2">
                {opcoes.map((opcao) => (
                  <Button
                    key={opcao}
                    variant={selecoes[estrutura] === opcao ? "default" : "outline"}
                    onClick={() => setSelecoes({ ...selecoes, [estrutura]: opcao })}
                  >
                    {opcao}
                  </Button>
                ))}
              </div>
              <Input
                placeholder="Inserir medidas (ex: 12,3 x 4,5 cm)"
                value={medidas[estrutura] || ""}
                onChange={(e) => setMedidas({ ...medidas, [estrutura]: e.target.value })}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}

      <Button onClick={gerarLaudo} className="mb-4">Gerar Laudo</Button>
      <Card>
        <CardContent className="p-4">
          <Textarea value={laudo} readOnly className="w-full h-96" />
        </CardContent>
      </Card>
    </div>
  );
}
