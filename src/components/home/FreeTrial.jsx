
import Container from "../shared/Container";
import { GiLaurelCrown } from "react-icons/gi";
import BaseButton from "../ui/BaseButton";
import { BsArrowRight } from "react-icons/bs";

const FreeTrial = () => {
    return (
        <section className="py-20 md:py-24">
            <Container>
                <div className="space-y-4">
                    <h3 className="inline-flex gap-3 text-lg uppercase text-foreground items-center"><GiLaurelCrown className="text-amber-500 dark:text-yellow-500 drop-shadow-[0_2px_8px_rgba(234,179,8,0.2)] dark:drop-shadow-[0_4px_12px_rgba(234,179,8,0.4)] transition-all duration-300" /> Premium</h3>
                    <div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">Go deeper. <br /> Grow further.</h1>
                    </div>
                    <p className="text-sm text-muted">Unlock exclusive stories, expert insights, and tools <br /> designed to help you live a more intentional life</p>
                    <div className="mt-10">
                        <BaseButton animated text={'Start Your Free Trial'} rightIcon={<BsArrowRight />} />
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default FreeTrial;