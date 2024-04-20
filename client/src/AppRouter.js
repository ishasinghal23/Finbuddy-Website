import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Investment from './Investment';
import StockPricePrediction from './StockPricePrediction';

const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Investment} />
        <Route path="/stock-price-prediction" component={StockPricePrediction} />
        {/* Add more routes for other pages if needed */}
      </Switch>
    </Router>
  );
};

export default AppRouter;
