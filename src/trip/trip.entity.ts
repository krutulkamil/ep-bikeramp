import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, BeforeUpdate } from 'typeorm';

@Entity('trip')
export class TripEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @CreateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date();
    }

    @Column({ name: 'start_address' })
    startAddress: string;

    @Column({ name: 'destination_address' })
    destinationAddress: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'date' })
    date: Date;

    @Column()
    distance: number;
}