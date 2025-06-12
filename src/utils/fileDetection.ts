
interface Representative {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export const detectRepresentativeFromFileName = (fileName: string, representatives: Representative[]) => {
  const normalizedFileName = fileName.toLowerCase()
    .replace(/[_-]/g, ' ')
    .replace(/\.[^/.]+$/, ''); // Remove extensão

  console.log('Detectando representante para arquivo:', fileName);
  console.log('Nome normalizado:', normalizedFileName);

  for (const rep of representatives) {
    const repName = rep.name.toLowerCase();
    const repWords = repName.split(' ');
    const firstName = repWords[0];
    const lastName = repWords[repWords.length - 1];

    // Verifica nome completo
    if (normalizedFileName.includes(repName.replace(/\s+/g, ''))) {
      console.log('Encontrado por nome completo:', rep.name);
      return rep;
    }

    // Verifica primeiro nome
    if (normalizedFileName.includes(firstName)) {
      console.log('Encontrado por primeiro nome:', rep.name);
      return rep;
    }

    // Verifica último nome (sobrenome)
    if (lastName.length > 2 && normalizedFileName.includes(lastName)) {
      console.log('Encontrado por sobrenome:', rep.name);
      return rep;
    }

    // Verifica palavras individuais do nome
    const fileWords = normalizedFileName.split(/\s+/);
    const matchingWords = repWords.filter(word => 
      word.length > 2 && fileWords.some(fileWord => 
        fileWord.includes(word) || word.includes(fileWord)
      )
    );

    if (matchingWords.length >= 2) {
      console.log('Encontrado por múltiplas palavras:', rep.name);
      return rep;
    }
  }

  console.log('Nenhum representante encontrado para:', fileName);
  return null;
};

export const suggestFileNames = (representativeName: string) => {
  const firstName = representativeName.split(' ')[0].toLowerCase();
  const normalizedName = representativeName.toLowerCase().replace(/\s+/g, '-');
  
  return [
    `relatorio-${firstName}.pdf`,
    `documento-${normalizedName}.pdf`,
    `${firstName}-apresentacao.pptx`,
    `planilha-${firstName}.xlsx`,
    `contrato-${normalizedName}.docx`
  ];
};
