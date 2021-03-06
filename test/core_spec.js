import {expect} from 'chai';
import {List, Map} from 'immutable';
import {setEntries, next, vote} from '../src/core';

describe('application logic', () => {

	describe('setEntries', () => {

		it('add the entries to the state', () => {
			const state = Map();
			//const entries = List.of('Trainspotting','28 days Later');
			const entries = ['Trainspotting', '28 days Later'];
			const nextState = setEntries(state, entries);
			expect(nextState).to.equal(Map({
				entries: List.of('Trainspotting', '28 days Later')
			}));
		});

	});

	describe('next', () => {
		it('takes the next two entries under vote', () => {
			const state = Map({
				entries: List.of('Trainspotting', '28 days later', 'Sunshine')
			})
			const nextState = next(state);
			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of('Trainspotting', '28 days later')
				}),
				entries: List.of('Sunshine')
			}));
		});
	});

	describe('vote', () => {

		it('creates a tally for the voted entry', () =>{
			const state = Map({
				pair: List.of('Trainspotting', '28 days later')
			});
			const nextState = vote(state, 'Trainspotting');
			expect(nextState).to.equal(Map({
				pair: List.of('Trainspotting', '28 days later'),
				tally: Map({
					'Trainspotting': 1
				})
			}));
		});

		it('adds to existing tally for the voted entry', () => {
			const state = Map({
				pair: List.of('Trainspotting', '28 days later'),
				tally: Map({
					'Trainspotting': 3,
					'28 days later': 2
				})
			});
			const nextState = vote(state, 'Trainspotting');
			expect(nextState).to.equal(Map({
				pair: List.of('Trainspotting', '28 days later'),
				tally: Map({
					'Trainspotting': 4,
					'28 days later': 2
				})
			}));			
		});

		it('puts winner of current vote back to entries', () => {
			const state = Map({
				vote: Map({
					pair: List.of('Trainspotting', '28 days later'),
					tally: Map({
						'Trainspotting': 4,
						'28 days later': 2
					})
				}),
				entries: List.of('Sunshine','Millions','127 hours')
			});
			const nextState = next(state);
			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of('Sunshine', 'Millions')
				}),
				entries: List.of('127 hours', 'Trainspotting')
			}));

		});

		it('puts both from tied vote back to entries', () => {
			const state = Map({
				vote: Map({
					pair: List.of('Trainspotting', '28 days later'),
					tally: Map({
						'Trainspotting':3,
						'28 days later': 3
					})
				}),
				entries: List.of('Sunshine','Millions','127 hours')
			});
			const nextState = next(state);
			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of('Sunshine','Millions')
				}),
				entries: List.of('127 hours', 'Trainspotting', '28 days later')
			}));
		});

		it('marks winner when just one entry left', () => {
			const state = Map({
				vote: Map({
					pair: List.of('Trainspotting', '28 days later'),
					tally: Map({
						'Trainspotting': 4,
						'28 days later': 2
					})
				}),
				entries: List()
			});
			const nextState = next(state);
			expect(nextState).to.equal(Map({
				winner: 'Trainspotting'
			}));
		});

	});

});