import {
  PoolCreated,
  UpdateAdmin,
} from "../generated/PoolFactory/PoolFactory"
import { PoolIDO } from "../generated/templates"
import { AdminEntity, BuyTicketEntity, PoolIDOEntity } from "../generated/schema"
import { BuyTicket } from "../generated/templates/PoolIDO/PoolIDO"


export function handlePoolCreated(event: PoolCreated): void {
  PoolIDO.create(event.params.pool)
  let poolIDO = PoolIDOEntity.load(event.params.pool.toHex())

  if (!poolIDO) {
    poolIDO = new PoolIDOEntity(event.params.pool.toHex())
  }
  poolIDO.registed_by = event.params.registedBy;
  poolIDO.token = event.params.token;
  poolIDO.ticket = event.params.ticket;
  poolIDO.vesting = event.params.vesting;
  poolIDO.pool_id = event.params.poolId;
  poolIDO.created_at = event.block.timestamp;
  poolIDO.block_number = event.block.number;
  poolIDO.save()

}

export function handleBuyTicket(event: BuyTicket): void {
  let buyTicket = BuyTicketEntity.load(event.transaction.hash.toHex())

  if (!buyTicket) {
    buyTicket = new BuyTicketEntity(event.transaction.hash.toHex())
  }

  if (event.transaction.to) {
    let pool_ido = PoolIDOEntity.load(event.address.toHex());
    if (pool_ido) {
      buyTicket.user = event.params._to;
      buyTicket.amount = event.params._amount;
      buyTicket.ticket_id = event.params._id;
      buyTicket.quantity = event.params._quantity;
      buyTicket.created_at = event.block.timestamp;
      buyTicket.block_number = event.block.number;
      buyTicket.pool_contract = pool_ido.id;
      buyTicket.save()
    }
  }

  
}

export function handleUpdateAdmin(event: UpdateAdmin): void {
  let admin = AdminEntity.load(event.params.user.toHex());

  if (!admin) {
    admin = new AdminEntity(event.params.user.toHex());
  }

  admin.status = event.params.status;
  admin.tx_hash = event.transaction.hash;
  admin.added_by = event.transaction.from;
  admin.created_at = event.block.timestamp;

  admin.save();
}