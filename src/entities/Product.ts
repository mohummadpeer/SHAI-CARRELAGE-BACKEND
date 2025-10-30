import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  name!: string;

  @Column("text")
  description!: string;

  @Column("varchar")
  color!: string;

  @Column("varchar")
  colorCode!: string;

  @Column("varchar")
  dimensions!: string;

  @Column("float")
  width!: number;

  @Column("float")
  height!: number;

  @Column("decimal")
  price!: number;

  @Column("int")
  stock!: number;

  @Column("varchar")
  category!: string;

  @Column("varchar")
  subcategory!: string;

  @Column("varchar")
  material!: string;

  @Column("varchar")
  finish!: string;

  @Column("float")
  rating!: number;

  @Column("int")
  reviews!: number;

  @Column("jsonb")
  images!: string[];
}
