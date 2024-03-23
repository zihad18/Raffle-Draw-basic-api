const Ticket = require('./Ticket')
const {readFile, writeFile} = require('./utils')

const tickets = Symbol('tickets')

class TicketCollection {

    constructor(){
        (async function () {
            const data = await readFile();
            this[tickets] = data;
        }.call(this));
    }

    /**
     * create and save a new ticket
     * @param {string} username 
     * @param {number} price 
     * @returns {Ticket}
     */
    create(username, price) {
        const ticket = new Ticket(username, price);
        this[tickets].push(ticket);
        writeFile(this[tickets]);
        return ticket;

    }

    /**
     * create bulk tickets
     * @param {string} username 
     * @param {number} price 
     * @param {number} quantity 
     * @return {Ticket[]}
     */
    createBulk(username, price, quantity)
    {
        const result = []

        for (let i =0; i < quantity; i++){
            const ticket = this.create(username, price);
            result.push(ticket);
        }
        writeFile(this[tickets]);
        return result;
    
    }

    /**
     * return all tickets from db
     * @returns 
     */
    find() {
        return this[tickets];
    }

    /**
     * find single ticket by id
     * @param {string} id 
     * @returns {Ticket}
     */
    findById(id){
        const ticket = this[tickets].find(
            /**
             * @param {Ticket} ticket
             */
            (ticket) => ticket.id == id
        );

        return ticket;
    }

    /**
     * find tickets by username
     * @param {string} username
     * @returns {Ticket[]}
     */
    findByUsername(username){
        const ticketsOfUsername = this[tickets].filter(
            /**
             * @param {Ticket} ticket
             */
            (ticket) => ticket.username == username
        );

        return ticketsOfUsername;
    }

    /**
     * 
     * @param {string} ticketId 
     * @param {{username: string, price: number}} ticketBody
     * @returns {Ticket} 
     */
    updateById(ticketId, ticketBody) {
        const ticket = this.findById(ticketId);
        if(ticket){
            ticket.username = ticketBody.username ?? ticket.username;
            ticket.price = ticketBody.price ?? ticket.price;

        }
        writeFile(this[tickets]);
        return ticket;

    }
    
    /**
     * bulk update by username
     * @param {string} username 
     * @param {{username: string, price: number}} ticketBody
     * @returns {Ticket[]}  
     */
    updateBulk(username, ticketBody){
        const userTickets = this.findByUsername(username);
        const updatedTickets = userTickets.map(
            /**
             * @param {Ticket} ticket
             */
            (ticket) => this.updateById(ticket.id, ticketBody)
        );
        writeFile(this[tickets]);
        return updatedTickets;
    }

    /**
     * delete ticket by id
     * @param {string} ticketId 
     * @return {boolean}
     */
   async deleteById(ticketId){
        const index = this[tickets].findIndex(
            /**
             * @param {Ticket} ticket
             */
            (ticket) => ticket.id == ticketId
        );

        if(index == -1)
        {
            return false
        }
        else{
          this[tickets].splice(index, 1);
          await writeFile(this[tickets]);
          return true; 
        }
    }

    /**
     * bulk delete by username
     * @param {string} username 
     * @return {boolean[]}
     */
    async deleteBulk(username)
    {
        const userTickets = this.findByUsername(username);
        const deleteResult = userTickets.map(
            /** 
             * @param {ticket} ticket
            */
           (ticket) => this.deleteById(ticket.id)
        );
        await Promise.all(deleteResult);
        await writeFile(this[tickets]);
        return this.deleteResult;

    }

    /**
     * Find winners
     * @param {number} winnerCount
     * @return {Ticket[]} 
     */
    draw(winnerCount) {
        const winnerIndexes = new Array(winnerCount);

        let winnerIndex = 0;
        while(winnerIndex < winnerCount){
            let ticketIndex = Math.floor(Math.random() * this[tickets].length );
            if(!winnerIndexes.includes(ticketIndex)){
                winnerIndexes[winnerIndex++] = ticketIndex;
                continue;
            }
        }

        const winners = winnerIndexes.map(
            /**
             * @param {number} index
             */
            (index) => this[tickets][index]
        );
        return winners;

    }
    
}

const ticketCollection = new TicketCollection();

module.exports = ticketCollection;