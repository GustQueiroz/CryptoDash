# CryptoDash

O **CryptoDash** é um aplicativo de dashboard de criptomoedas que permite aos usuários visualizar informações sobre várias criptomoedas, incluindo preços, capitalização de mercado e volume de negociação. O sistema também permite que os usuários comprem, vendam e troquem criptomoedas, além de gerenciar seu saldo.

## Funcionalidades

- **Visualização de Criptomoedas**: Acompanhe o preço, capitalização de mercado e volume de negociação de diversas criptomoedas.
- **Top Gainers e Losers**: Veja quais criptomoedas tiveram as maiores variações de preço nas últimas 24 horas.
- **Gerenciamento de Saldo**: Os usuários podem gerenciar seu saldo e realizar transações de compra e venda de criptomoedas.
- **Atualizações em Tempo Real**: Os dados das criptomoedas são atualizados a cada 5 segundos, proporcionando uma experiência dinâmica.

## Como Funciona o Algoritmo

O algoritmo de atualização de preços do CryptoDash funciona da seguinte maneira:

1. **Atualização Frequente**: Os valores das criptomoedas são atualizados a cada 5 segundos.
2. **Variação Aleatória**: Cada criptomoeda tem 50% de chance de não ter seu valor alterado em cada atualização. Se houver uma alteração, o valor pode variar entre -1% e +1%.
3. **Cálculo de Novos Valores**:
   - Se a variação for aplicada, o novo preço e a nova capitalização de mercado são calculados com base na variação aleatória.
   - A variação de preço em 24 horas é atualizada apenas se houver uma alteração no preço.
4. **Top Gainers e Losers**: Após cada atualização, o sistema recalcula quais são as 5 criptomoedas que mais ganharam e perderam valor.

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/GustQueiroz/CryptoDash
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd CryptoDash
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o aplicativo:
   ```bash
   npm run dev
   ```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir um pull request ou relatar problemas.

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
