interface FearAndGreedData {
    score: number;
    rating: string;
    timestamp: string;
    previous_close: number;
    previous_1_week: number;
    previous_1_month: number;
    previous_1_year: number;
}

interface HistoricalData {
    timestamp: number;
    score: number;
    rating: string;
    data: {
        x: number;
        y: number;
        rating: string;
    }[];
}

interface MarketMomentumData {
    timestamp: number;
    score: number;
    rating: string;
    data: Array<Record<string, any>>;
}

interface StockPriceData {
    timestamp: number;
    score: number;
    rating: string;
    data: Array<Record<string, any>>;
}

interface PutCallOptionsData {
    timestamp: number;
    score: number;
    rating: string;
    data: Array<Record<string, any>>;
}

interface MarketVolatilityData {
    timestamp: number;
    score: number;
    rating: string;
    data: Array<Record<string, any>>;
}

interface JunkBondDemandData {
    timestamp: number;
    score: number;
    rating: string;
    data: Array<Record<string, any>>;
}

interface SafeHavenDemandData {
    timestamp: number;
    score: number;
    rating: string;
    data: Array<Record<string, any>>;
}

interface FearAndGreedIndex {
    fear_and_greed: FearAndGreedData;
    fear_and_greed_historical: HistoricalData;
    market_momentum_sp500: MarketMomentumData;
    market_momentum_sp125: MarketMomentumData;
    stock_price_strength: StockPriceData;
    stock_price_breadth: StockPriceData;
    put_call_options: PutCallOptionsData;
    market_volatility_vix: MarketVolatilityData;
    market_volatility_vix_50: MarketVolatilityData;
    junk_bond_demand: JunkBondDemandData;
    safe_haven_demand: SafeHavenDemandData;
}