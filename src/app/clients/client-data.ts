import { InMemoryDbService } from 'angular-in-memory-web-api';

import { IClient } from './client';

export class ClientData implements InMemoryDbService {

    createDb() {
        const clients: IClient[] = [
            {"id":1,"prenom":"DANIEL","nom":"VORNICU"},
            {"id":2,"prenom":"ALINA","nom":"VORNICU"},
            {"id":3,"prenom":"LUCA","nom":"VORNICU"},
            {"id":4,"prenom":"SOFIA","nom":"VORNICU"},
            {"id":5,"prenom":"ERIC","nom":"SIBER"},
        ];
        return { clients };
    }
}
