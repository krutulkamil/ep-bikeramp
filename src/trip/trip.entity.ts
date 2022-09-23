import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, BeforeUpdate } from 'typeorm';

@Entity('trip')
export class TripEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    updated_at: Date;

    @BeforeUpdate()
    updateTimestamp() {
        this.updated_at = new Date();
    }

    @Column()
    start_address: string;

    @Column()
    destination_address: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'date' })
    date: Date;

    @Column()
    distance: number;
}