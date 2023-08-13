import { Sizes } from "../Experience";

export abstract class Manager {

	public abstract start(): void;

	public abstract stop(): void;

	public abstract update(): void;

	public abstract animate(): void;


}