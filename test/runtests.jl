using Peggy
using Test

@testset "Peggy.jl" begin

    @testset "literal" begin
        p = parser("abc")
        @test runpeg(p, "abc") == "abc"
        @test_throws ["ParseException", "1", "abc"] runpeg(p, "aboops")

        p = parser("a", "b", "c")
        @test runpeg(p, "a bcd") == ("a", "b", "c")
        @test_throws ["ParseException", "3", "c"] runpeg(p, "aboops")

        p = parser(oneof("cat", "dog"))
        @test runpeg(p, "catetonic") == "cat"
        @test runpeg(p, "dogma") == "dog"
        @test_throws ["ParseException", "cat", "dog"] runpeg(p, "do gma")

        p = parser(lit("a"; skiptrailing=r"X"), "b", "c")
        @test runpeg(p, "abcd") == ("a", "b", "c")
        @test runpeg(p, "aXbcd") == ("a", "b", "c")
        @test_throws ["ParseException"] runpeg(p, "aXXbc")
        @test_throws ["ParseException"] runpeg(p, "a bc")
    end

    p = parser("abc")
    p = many(oneof("a", "b"))
    @test runpeg(p, "") == []
    @test runpeg(p, "abbabca") == ["a", "b", "b", "a", "b"]

    p = parser(r"a.*z")
    @test runpeg(p, "abc...z!") == "abc...z"
    @test_throws ["ParseException", "1"] runpeg(p, "zab")

    p = parser("The end.", END)
    @test runpeg(p, "The end.") == ("The end.", ())
    @test_throws ["ParseException", "9"] runpeg(p, "The end...")

    p = parser(
        oneof(
            r"\d+" => x -> parse(Int, x),
            ["nix", "nada"],
            "nix" => nothing,
            [not("backtrack"), r"\w+"] => Symbol ∘ last,
            "backtrack!"
        ),
        "." => ()
    )
    @test runpeg(p, "42.") == (42, ())
    @test runpeg(p, "nix.") == (nothing, ())
    @test runpeg(p, "cool.") == (:cool, ())
    @test runpeg(p, "backtrack!.") == ("backtrack!", ())
    @test_throws ["ParseException", "5"] runpeg(p, "oops!")

    maplast(vs) = map(last, vs)
    p = grammar(
        :expr => [:term,
            many("+", :term) => maplast
        ] => x -> sum([x[1], x[2]...]),
        :term => [:factor,
            many("*", :factor) => maplast
        ] => x -> prod([x[1], x[2]...]),
        :factor => oneof(:number, ["(", :expr, ")"] => x -> x[2]),
        :number => r"\d+" => v -> parse(Int, v),
    )
    @test runpeg(p, "2+3*4+5") == 19

    @testset "left-recursive" begin
        p = grammar(
            :start => [:as, END] => first,
            :as => oneof(
                [:as, "a"] => r -> r[1] * "a",
                "a")
        )
        @test p("aaa") == "aaa"

        sp = r"\s*"
        toylang = grammar(
            :start => [sp, :expr, END] => x -> x[2],
            :expr => oneof(
                [:var, "=", sp, :expr] => x -> ("=", first(x), last(x)),
                :term),
            :term => oneof(
                [:term, oneof("+", "-"), sp, :prod] => x -> (x[2], x[1], x[4]),
                :prod),
            :prod => oneof(
                [:prod, oneof("*", "/"), sp, :prim] => x -> (x[2], x[1], x[4]),
                :prim),
            :prim => oneof(
                ["-", :prim] => x -> ("neg", last(x)),
                ["(", sp, :exp, ")", sp] => x -> x[3],
                :var,
                :number),
            :number => [r"[[:digit:]]+", sp] => x -> parse(Int, first(x)),
            :var => [r"[_[:alpha:]][_[:alpha:][:digit:]]*", sp] => Symbol ∘ first,
        )
        @test toylang("a = b = c + d*e - f") == ("=", :a, ("=", :b, ("-", ("+", :c, ("*", :d, :e)), :f)))
    end

    @testset "macro syntax" begin

        @testset "rule" begin
            g = @peg begin
                start = {
                    as !anych(); # without an action & a single named exprresion,
                    "deprecated" start {{length(start)}};
                    "action" start :> {(start, length(start))};
                    "function" start :> length;
                    "number" ds=:["[:digit:]"]+_ :> {parse(Int, *(ds...))};
                }
                # the result is un-tupled.
                as = {as "a" :> {as * "a"}; "a"}
            end
            @test g(repeat("a", 3)) == repeat("a", 3)
            @test g("action aaaa") == ("aaaa", 4)
            @test g("function aa") == 2
            @test_throws ["ParseException", "!"] g("aaa!")
            @test g("number 420") == 420
        end

        @testset "many/cardinality" begin
            p = @peg({v="x"*_ "."})
            @test p("xx.") == ["x", "x"]
            @test p(".") == []

            p = @peg({v="y"*(1:2) "."})
            @test_throws ParseException p(".")
            @test p("y.") == ["y"]
            @test p("yy.") == ["y", "y"]
            @test_throws ParseException p("yyy.")

            p = @peg({v="x"+_ "."})
            @test p("x.") == ["x"]
            @test p("xx.") == ["x", "x"]
            @test_throws ParseException p(".")

            @test_throws ParseException @peg({ "2+"*2 })("2+")
            @test @peg({ "2+"*2 })("2+"^2) == repeat(["2+"], 2)
            @test @peg({ "2+"*2} )("2+"^4) == repeat(["2+"], 4)
        end

        @testset "misc failures fixed" begin
            p = @peg({"need '()'" !({"X" ; "Y"})})
            @test p("need '()' z") == ()
            @test_throws ParseException p("need '()' X")
        end

        @testset "expressions" begin
            p = @peg begin
                tests = {
                    "a !b:" a !b;
                    #"many" a*_ e
                }
                a = "A"
                b = "B"
            end
            @test p("a !b: A C") == "A"
            @test_throws ParseException p("a !b: A B")
            #@test p("ABC") == (a="A", b="B")
        end

        @testset "precedence" begin
            p = @peg begin
                alts = {
                    "simple" v=(a||b) ".";
                }
                a = "A"
                b = "B"
            end

            @test p("simple A.") == "A"
            @test p("simple B.") == "B"
            @test_throws ParseException p("C.")
        end

        #=
        g = @grammar begin
            start = [
                space expr !anych() {expr}
            ]
            expr = [
                expr "+" space term {expr + term}
                expr "-" space term {expr - term}
                term
            ]
            term = [
                term "*" space prim {term * prim}
                term "/" space prim {term / prim}
                prim
            ]
            prim = [
                number _=space # "_:" un-names the expression
                "(" expr ")"
            ]
            number = [
                D=anych("[:digit:]") DS=(anych("[:digit:]")...) {parse(Int, *(D, DS...))}
            ]
            space = many(anych("[:space:]"))
        end
        @test g("1+2*3+10/2 - 4") == 8
        #2# =#
    end

    @testset "LookAhead" begin
        p = @peg {r="hello" followedby(",")}
        @test p("hello, world!") == "hello"
        @test_throws ["ParseException"] p("hello!")
    end

    @testset "sequnce results" begin
        @test (@peg "a")("a") == "a"
        @test (@peg {"1" "2" "3"})("123") == ()
        @test (@peg {"1" a="2" "3"})("123") == "2"
        @test (@peg {a="1" "2" b="3"})("123") == (a="1", b="3")
        @test (@peg {"1" "2" "3"})("123") == ()
        p = @grammar begin
            tests = nonsequence / nameless_seq / one_name / many_names
            nonsequence = "nonseq"
            nameless_seq = {"no" _=name "s"}
            one_name = {"one" name}
            many_names = {"has" a="many" b=name name "s"}
            name = "name"
        end
        @test p("nonseq") == "nonseq"
        @test p("no names") == ()
        @test p("one name") == "name"
        @test p("has many name names") == (a="many", b="name", name="name")
    end
end