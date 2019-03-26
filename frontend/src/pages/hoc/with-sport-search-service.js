import React from 'react';
import { SportSearchServiceConsumer } from '../sport-search-service-context';

const withSportSearchService = () => (Wrapped) => {

  return (props) => {
    return (
      <SportSearchServiceConsumer>
        {
          (sportSearchService) => {
            return (<Wrapped {...props}
               
              sportSearchService={sportSearchService}/>);
          }
        }
      </SportSearchServiceConsumer>
    );
  }
};

export default withSportSearchService;
