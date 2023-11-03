import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'uuid',
    unique: true,
    default: () => 'uuid_generate_v4()',
    nullable: true,
  })
  @Generated('uuid')
  code: string;

  @Column()
  database: string;
}
