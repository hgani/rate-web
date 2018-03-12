module EthHelper
  class Eth
    def self.node_url
      'https://rinkeby.infura.io/tQmR2iidoG7pjW1hCcCf'
    end

    def self.client(node_url = self.node_url)
      Ethereum::HttpClient.new(node_url)
    end
  end
end